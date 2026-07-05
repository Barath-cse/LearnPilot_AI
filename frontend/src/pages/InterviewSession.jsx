import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Send, Bot, User, Loader2, ArrowLeft, Mic } from 'lucide-react';

const InterviewSession = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get('type') || 'Technical';
  const level = searchParams.get('level') || 'Medium';
  const chatEndRef = useRef(null);
  
  const maxQuestions = level === 'Easy' ? 3 : level === 'Hard' ? 7 : 5;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [sessionOver, setSessionOver] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [evaluating, setEvaluating] = useState(false);

  // Set up Speech Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }

  const toggleListen = (e) => {
    e.preventDefault();
    if (!recognition) {
      alert("Your browser does not support Speech Recognition. Please try Google Chrome.");
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    const fetchInitialGreeting = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/interviews/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, level, message: `Hello, I am ready to start my ${type} interview. Please introduce yourself and ask the first question.` })
        });
        const data = await res.json();
        setMessages([
          { sender: 'ai', text: `Welcome to your ${level} ${type} Mock Interview. Let's begin.` },
          { sender: 'ai', text: data.reply }
        ]);
      } catch (err) {
        setMessages([
          { sender: 'ai', text: `Welcome to your ${type} Mock Interview.` },
          { sender: 'ai', text: type === 'Technical' ? 'Explain how a HashMap works internally in Java.' : 'Tell me about a time you faced a challenge in a project.' }
        ]);
      } finally {
        setIsTyping(false);
      }
    };

    fetchInitialGreeting();
  }, [type]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const endSession = async () => {
    if (messages.length <= 2) {
      // If user ends immediately without answering anything, just go back
      navigate('/dashboard/placement');
      return;
    }
    
    setEvaluating(true);
    setMessages(prev => [...prev, { sender: 'ai', text: 'Analyzing your answers and generating your final score...' }]);

    try {
      const historyStr = messages.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join('\n');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/interviews/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, history: historyStr })
      });
      const data = await res.json();
      const newScore = data.score || 75;

      const saved = JSON.parse(localStorage.getItem('learnpilot_mock_scores')) || { technical: 0, communication: 0, overall: 0, attended: false };
      
      if (type === 'Technical') {
        saved.technical = saved.attended && saved.technical > 0 ? Math.round((saved.technical + newScore) / 2) : newScore;
      } else {
        saved.communication = saved.attended && saved.communication > 0 ? Math.round((saved.communication + newScore) / 2) : newScore;
      }

      if (saved.technical > 0 && saved.communication > 0) {
        saved.overall = Math.round((saved.technical + saved.communication) / 2);
      } else {
        saved.overall = saved.technical > 0 ? saved.technical : saved.communication;
      }
      
      saved.attended = true;
      localStorage.setItem('learnpilot_mock_scores', JSON.stringify(saved));
    } catch (e) {
      console.error("Failed to evaluate and save score", e);
    } finally {
      setEvaluating(false);
      navigate('/dashboard/placement');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sessionOver) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    const newCount = questionCount + 1;
    setQuestionCount(newCount);

    if (newCount >= maxQuestions) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { sender: 'ai', text: 'Thank you. That concludes our mock interview session today. Great job! You can now view your feedback.' }
        ]);
        setIsTyping(false);
        setSessionOver(true);
      }, 1000);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/interviews/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, level, message: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Error connecting to the interviewer.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <button onClick={endSession} className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition">
          <ArrowLeft className="w-4 h-4 mr-2" /> End Interview
        </button>
        <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">{type} Interview</span>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 max-w-[80%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'ai' ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-600'}`}>
                {msg.sender === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className={`p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-primary-600 text-white rounded-tr-sm' : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-sm'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-500 rounded-tl-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> AI is typing...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          {sessionOver ? (
            <div className="text-center p-4">
              <button 
                onClick={endSession} 
                disabled={evaluating}
                className="bg-primary-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-primary-700 transition disabled:opacity-50"
              >
                {evaluating ? 'Generating Report...' : 'View Feedback Report & Score'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSend} className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your answer here..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                disabled={isTyping}
              />
              <button
                type="button"
                onClick={toggleListen}
                disabled={isTyping}
                className={`p-3 rounded-xl transition shrink-0 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                title="Use Microphone"
              >
                <Mic className="w-5 h-5" />
              </button>
              <button 
                type="submit" 
                disabled={isTyping || !input.trim()}
                className="bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 transition disabled:opacity-50 shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
