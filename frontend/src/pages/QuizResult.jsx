import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Trophy, AlertCircle, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

const QuizResult = () => {
  const location = useLocation();
  const result = location.state || { score: 0, total: 0, weakTopics: [] };
  const percentage = Math.round((result.score / result.total) * 100) || 0;

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-8 text-center">
      <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-primary-500 to-purple-500"></div>
        
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-yellow-50 rounded-full">
            <Trophy className="w-12 h-12 text-yellow-500" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-slate-900 mb-2">Quiz Complete!</h1>
        <p className="text-slate-500 mb-8">Here is your AI generated performance report.</p>

        <div className="flex justify-center items-end gap-2 mb-8">
          <span className="text-6xl font-black text-slate-900">{percentage}%</span>
          <span className="text-xl text-slate-500 font-medium mb-1">Score</span>
        </div>

        {result.weakTopics.length > 0 ? (
          <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-left">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h3 className="font-bold text-red-900 text-lg">Needs Improvement</h3>
            </div>
            <p className="text-red-700 mb-4">Our AI agent detected weakness in the following topics. They have been added to your learning roadmap.</p>
            <div className="flex flex-wrap gap-2">
              {result.weakTopics.map(topic => (
                <span key={topic} className="px-3 py-1 bg-white border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-100 p-6 rounded-2xl">
            <p className="text-green-800 font-medium text-lg">Excellent work! No major weaknesses detected.</p>
          </div>
        )}
      </div>

      {result.quiz && result.quiz.questions && (
        <div className="space-y-6 text-left mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-4">Detailed Breakdown</h2>
          {result.quiz.questions.map((q, idx) => {
            const userAnswerIdx = result.userAnswers ? result.userAnswers[q.id] : -1;
            const isCorrect = userAnswerIdx === q.correctOptionIndex;
            return (
              <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex gap-4 mb-4">
                  <div className="mt-1">
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {idx + 1}. {q.text}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 pl-10 mb-4">
                  {q.options.map((opt, optIdx) => {
                    let className = "p-3 rounded-xl border ";
                    if (optIdx === q.correctOptionIndex) {
                      className += "border-green-500 bg-green-50 text-green-900 font-medium";
                    } else if (optIdx === userAnswerIdx && !isCorrect) {
                      className += "border-red-300 bg-red-50 text-red-800";
                    } else {
                      className += "border-slate-100 text-slate-500";
                    }

                    return (
                      <div key={optIdx} className={className}>
                        {opt}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div className="pl-10 mt-4 text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-1">AI Explanation:</span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-center gap-4 mt-8 pt-8 border-t border-slate-100">
        <Link to="/dashboard/quizzes" className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition">
          Take Another Quiz
        </Link>
        <Link to="/dashboard/learning" className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition flex items-center gap-2 shadow-lg shadow-primary-500/20">
          Go to Roadmap <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default QuizResult;
