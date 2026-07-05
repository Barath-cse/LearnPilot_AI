import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Bookmark, PlayCircle } from 'lucide-react';

const TopicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Mock content fetching
  const topic = {
    id,
    title: id === 't1' ? 'Introduction to Java' : 'Spring Boot Basics',
    content: `
      Java is a high-level, class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible.
      
      ## Key Features
      * Object-Oriented
      * Platform Independent (Write Once, Run Anywhere)
      * Simple and Familiar
      * Secure
      * Robust
      
      ## Getting Started
      To start programming in Java, you need the Java Development Kit (JDK) installed on your system.
    `,
    estimatedHours: 2,
  };

  const handleComplete = () => {
    // In real app, make API call to markTopicCompleted
    setCompleted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button 
        onClick={() => navigate('/dashboard/learning')}
        className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Roadmap
      </button>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-start mb-8 pb-8 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-2.5 py-0.5 rounded uppercase tracking-wider">Lesson</span>
              <span className="text-sm text-slate-500 flex items-center gap-1">
                <PlayCircle className="w-4 h-4" /> {topic.estimatedHours} Hours
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">{topic.title}</h1>
          </div>
          <button 
            onClick={() => setBookmarked(!bookmarked)}
            className={`p-3 rounded-xl transition ${bookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
            title="Bookmark this topic"
          >
            <Bookmark className="w-5 h-5" fill={bookmarked ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Content Area - Typically would use react-markdown here */}
        <div className="prose prose-slate max-w-none mb-10">
          {topic.content.split('\n').map((paragraph, idx) => {
            if(paragraph.trim().startsWith('##')) {
               return <h2 key={idx} className="text-xl font-bold mt-6 mb-3 text-slate-800">{paragraph.replace('##', '').trim()}</h2>
            }
            if(paragraph.trim().startsWith('*')) {
               return <li key={idx} className="ml-4 text-slate-700">{paragraph.replace('*', '').trim()}</li>
            }
            return <p key={idx} className="text-slate-700 mb-4">{paragraph}</p>;
          })}
        </div>

        <div className="flex justify-between items-center pt-8 border-t border-slate-100 bg-slate-50 -mx-8 -mb-8 p-8 rounded-b-2xl">
          <div className="text-slate-600 text-sm">
            {completed ? "You have mastered this topic." : "Ready to complete this topic?"}
          </div>
          <button 
            onClick={handleComplete}
            disabled={completed}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
              completed 
                ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-500/20'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            {completed ? 'Completed' : 'Mark as Complete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;
