import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const CodeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/coding/problems/${id}`)
      .then(res => res.json())
      .then(data => {
        setProblem(data);
        setCode(data.initialCode || '// Write your code here');
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/coding/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: id,
          studentId: 'user123',
          language: 'Java',
          code: code
        })
      });
      const data = await res.json();
      setFeedback({
        score: data.score,
        text: data.feedback
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Loading problem...</p>
      </div>
    );
  }

  if (!problem) return <div>Problem not found</div>;

  return (
    <div className="h-full flex flex-col space-y-4">
      <button 
        onClick={() => navigate('/dashboard/coding')}
        className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition w-fit"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Problems
      </button>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]">
        {/* Problem Description */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm overflow-y-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{problem.title}</h2>
          <div className="flex gap-2 mb-6">
            <span className={`text-xs px-2 py-1 rounded-md border ${
              problem.difficulty === 'Easy' ? 'text-green-600 bg-green-50 border-green-200' :
              problem.difficulty === 'Hard' ? 'text-red-600 bg-red-50 border-red-200' :
              'text-yellow-600 bg-yellow-50 border-yellow-200'
            }`}>
              {problem.difficulty}
            </span>
            {problem.tags && problem.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 rounded-md border border-slate-200 bg-slate-50 text-slate-600">
                {tag}
              </span>
            ))}
          </div>
          <div className="prose prose-sm text-slate-700 whitespace-pre-wrap">
            {problem.description}
          </div>
        </div>

        {/* Code Editor & Feedback */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 bg-[#1e1e1e] rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-sm">
            <div className="bg-[#2d2d2d] px-4 py-2 flex justify-between items-center border-b border-[#404040]">
              <span className="text-slate-300 text-sm font-medium">Java</span>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-primary-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition flex items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">AI Analyzing...</span>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Submit Code
                  </>
                )}
              </button>
            </div>
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 w-full bg-[#1e1e1e] text-slate-300 p-4 font-mono text-sm resize-none outline-none"
              spellCheck="false"
            />
          </div>

          {/* AI Feedback Panel */}
          {feedback && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-64 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900">Coding Mentor Agent Review</h3>
                <span className="ml-auto font-bold text-lg text-primary-600">Score: {feedback.score}/100</span>
              </div>
              <div className="prose prose-sm max-w-none text-slate-700">
                {feedback.text.split('\n').map((line, i) => {
                  if (line.startsWith('##')) return <h4 key={i} className="text-slate-900 mt-4 mb-2">{line.replace(/#/g, '')}</h4>;
                  if (line.startsWith('✓')) return <p key={i} className="text-green-600 flex items-center gap-2 m-0"><CheckCircle2 className="w-4 h-4"/>{line.substring(1)}</p>;
                  return <p key={i} dangerouslySetInnerHTML={{__html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`(.*?)`/g, '<code class="bg-slate-100 px-1 rounded text-primary-600">$1</code>')}} />
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
