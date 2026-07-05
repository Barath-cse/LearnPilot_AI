import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowRight } from 'lucide-react';

const QuizList = () => {
  const [difficulty, setDifficulty] = React.useState('Medium');

  const topics = [
    { title: 'Java Core Concepts', iconColor: 'blue' },
    { title: 'Spring Boot Basics', iconColor: 'green' },
    { title: 'Data Structures', iconColor: 'purple' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Adaptive Quizzes</h1>
          <p className="text-slate-600 mt-1">Test your knowledge and let the AI find your weak spots.</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Difficulty:</label>
          <select 
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="Easy">Easy (5 Qs)</option>
            <option value="Medium">Medium (7 Qs)</option>
            <option value="Hard">Hard (10 Qs)</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col h-full">
            <div className="p-3 bg-blue-50 w-fit rounded-xl mb-4">
              <FileQuestion className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{topic.title}</h3>
            
            <div className="flex gap-4 text-sm text-slate-500 mb-6 flex-1">
              <span>{difficulty === 'Easy' ? 5 : difficulty === 'Hard' ? 10 : 7} Questions</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 self-center"></span>
              <span className={difficulty === 'Hard' ? 'text-red-500' : difficulty === 'Medium' ? 'text-yellow-600' : 'text-green-500'}>
                {difficulty}
              </span>
            </div>

            <Link 
              to={`/dashboard/quizzes/session?topic=${encodeURIComponent(topic.title)}&difficulty=${difficulty}`}
              className="w-full flex items-center justify-center gap-2 bg-slate-50 text-slate-700 py-2 rounded-xl font-medium hover:bg-primary-600 hover:text-white transition group"
            >
              Start Quiz <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
