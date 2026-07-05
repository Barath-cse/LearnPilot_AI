import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MessageSquare, Code, LineChart } from 'lucide-react';

const PlacementDashboard = () => {
  const [scores, setScores] = useState({ technical: 0, communication: 0, overall: 0, attended: false });
  const [difficulty, setDifficulty] = useState('Medium');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('learnpilot_mock_scores'));
      if (saved) {
        setScores(saved);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Placement Preparation</h1>
        <p className="text-slate-600 mt-1">Practice mock interviews and track your readiness score.</p>
      </div>

      {/* Readiness Overview */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="w-48 h-48 rounded-full border-8 border-slate-100 flex flex-col items-center justify-center shrink-0 relative overflow-hidden">
          {/* Fill effect based on score */}
          <div 
            className="absolute bottom-0 w-full bg-primary-100 transition-all duration-1000" 
            style={{ height: `${scores.overall}%` }} 
          />
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-5xl font-black text-primary-600">{scores.overall}%</span>
            <span className="text-sm text-slate-500 font-medium">Readiness Score</span>
          </div>
        </div>
        <div className="flex-1 space-y-4 w-full">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {scores.attended ? 'Ready for Product Companies' : 'Start Your Preparation'}
            </h2>
            <p className="text-slate-600 mt-1">
              {scores.attended 
                ? 'Your technical knowledge is strong, but your communication score can be improved with behavioral mock interviews.'
                : 'Take a mock interview below to generate your initial readiness score.'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-sm text-slate-500 block mb-1">Technical Score</span>
              <span className="text-2xl font-bold text-slate-900">{scores.technical}%</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-sm text-slate-500 block mb-1">Communication Score</span>
              <span className="text-2xl font-bold text-slate-900">{scores.communication}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interview Types */}
      <div className="flex items-center justify-between pt-4">
        <h2 className="text-2xl font-bold text-slate-900">Start a Mock Interview</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Difficulty:</label>
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="Easy">Easy (3 Qs)</option>
            <option value="Medium">Medium (5 Qs)</option>
            <option value="Hard">Hard (7 Qs)</option>
          </select>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: 'Technical Interview', icon: <Code className="w-8 h-8 text-blue-500" />, desc: 'Core Java, Spring Boot, DSA', type: 'Technical' },
          { title: 'HR Interview', icon: <Briefcase className="w-8 h-8 text-purple-500" />, desc: 'Culture fit, career goals', type: 'HR' },
          { title: 'Behavioral', icon: <MessageSquare className="w-8 h-8 text-green-500" />, desc: 'STAR method practice', type: 'Behavioral' },
        ].map((interview) => (
          <div key={interview.title} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col h-full">
            <div className="mb-4">{interview.icon}</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{interview.title}</h3>
            <p className="text-slate-500 mb-6 flex-1">{interview.desc}</p>
            <Link 
              to={`/dashboard/placement/interview?type=${interview.type}&level=${difficulty.split(' ')[0]}`}
              className="w-full text-center bg-primary-50 text-primary-700 py-2.5 rounded-xl font-medium hover:bg-primary-600 hover:text-white transition"
            >
              Start Session
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacementDashboard;
