import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Code2, ArrowRight, Loader2 } from 'lucide-react';

const CodingPractice = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/coding/problems`)
      .then(res => res.json())
      .then(data => {
        setProblems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getDifficultyColor = (diff) => {
    switch(diff) {
      case 'Easy': return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Hard': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Coding Practice</h1>
        <p className="text-slate-600 mt-1">Solve problems and get instant AI code reviews.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Loading coding workspace...</p>
        </div>
      ) : (
        <div className="grid gap-4">
        {problems.map(problem => (
          <Link 
            key={problem.id} 
            to={`/dashboard/coding/${problem.id}`}
            className="flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary-200 transition group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition">{problem.title}</h3>
                <div className="flex gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded-md border ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                  {problem.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-md border border-slate-200 bg-slate-50 text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-primary-600 bg-primary-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        ))}
      </div>
      )}
    </div>
  );
};

export default CodingPractice;
