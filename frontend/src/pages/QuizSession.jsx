import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';

const QuizSession = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const topic = searchParams.get('topic') || 'Java';
        const difficulty = searchParams.get('difficulty') || 'Medium';
        
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/quiz/generate?topic=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(difficulty)}`);
        if (res.ok) {
          const data = await res.json();
          setQuiz(data);
        } else {
          console.error("Failed to load quiz");
        }
      } catch (err) {
        console.error("Error connecting to server", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuiz();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">AI Agent generating adaptive questions...</p>
      </div>
    );
  }

  const handleSelect = (idx) => {
    setAnswers({ ...answers, [quiz.questions[currentIndex].id]: idx });
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    let score = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correctOptionIndex) score++;
    });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz.id,
          topic: quiz.topic,
          score: score,
          totalQuestions: quiz.questions.length,
          studentId: 'user123'
        })
      });
      const data = await res.json();
      navigate('/dashboard/quizzes/result', { 
        state: { 
          score: data.score, 
          total: data.totalQuestions, 
          weakTopics: data.weakTopics || [],
          quiz,
          userAnswers: answers
        } 
      });
    } catch (e) {
      console.error(e);
      navigate('/dashboard/quizzes/result', { 
        state: { 
          score, 
          total: quiz.questions.length, 
          weakTopics: [],
          quiz,
          userAnswers: answers
        } 
      });
    }
  };

  const currentQ = quiz.questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="mb-8 flex justify-between items-center text-sm font-medium text-slate-500">
        <span>Question {currentIndex + 1} of {quiz.questions.length}</span>
        <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full">{quiz.topic}</span>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">{currentQ.text}</h2>

        <div className="space-y-4">
          {currentQ.options.map((opt, idx) => {
            const isSelected = answers[currentQ.id] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-4 rounded-xl border-2 transition flex justify-between items-center ${
                  isSelected 
                    ? 'border-primary-500 bg-primary-50 text-primary-900 font-medium' 
                    : 'border-slate-100 hover:border-slate-300 text-slate-700'
                }`}
              >
                <span>{opt}</span>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-primary-500" />}
              </button>
            );
          })}
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleNext}
            disabled={answers[currentQ.id] === undefined || submitting}
            className="bg-primary-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-primary-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? 'Evaluating...' : currentIndex === quiz.questions.length - 1 ? 'Finish & Evaluate' : 'Next Question'}
            {!submitting && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizSession;
