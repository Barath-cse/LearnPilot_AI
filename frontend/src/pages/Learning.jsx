import React, { useEffect, useState, useCallback } from 'react';
import {
  CheckCircle, Clock, Loader, Sparkles, Search,
  ChevronDown, ChevronUp, ExternalLink, Trash2, History, Play, Plus
} from 'lucide-react';

const CAREER_ROADMAPS = {
  'Frontend Developer': [
    { id: 'f1', title: 'HTML & CSS Fundamentals', description: 'Master semantic HTML5 and modern CSS layout with Flexbox and Grid.', estimatedHours: 4 },
    { id: 'f2', title: 'JavaScript Essentials', description: 'Understand ES6+, closures, promises, async/await, and the event loop.', estimatedHours: 6 },
    { id: 'f3', title: 'React Fundamentals', description: 'Build dynamic UIs with components, props, state, and hooks.', estimatedHours: 8 },
    { id: 'f4', title: 'State Management', description: 'Manage global state using Context API and React Query.', estimatedHours: 4 },
    { id: 'f5', title: 'Performance & Testing', description: 'Optimize React apps and write unit tests with Vitest.', estimatedHours: 5 },
  ],
  'Backend Developer': [
    { id: 'b1', title: 'Java Core Concepts', description: 'Master OOP, collections, generics, and exception handling in Java.', estimatedHours: 6 },
    { id: 'b2', title: 'Spring Boot Basics', description: 'Build REST APIs with Spring Boot, DI, and MVC patterns.', estimatedHours: 8 },
    { id: 'b3', title: 'Database Design & MongoDB', description: 'Design schemas, write efficient queries, and connect to MongoDB.', estimatedHours: 5 },
    { id: 'b4', title: 'Authentication & Security', description: 'Implement JWT-based auth and secure APIs with Spring Security.', estimatedHours: 4 },
    { id: 'b5', title: 'System Design Basics', description: 'Learn scalability, caching, load balancing, and microservices.', estimatedHours: 6 },
  ],
  'Full Stack Developer': [
    { id: 'fs1', title: 'React + REST Integration', description: 'Build a full-stack app connecting React frontend to REST backend.', estimatedHours: 6 },
    { id: 'fs2', title: 'Spring Boot API Design', description: 'Create robust REST APIs with validation and error handling.', estimatedHours: 6 },
    { id: 'fs3', title: 'Authentication End-to-End', description: 'Implement JWT login/register flow from frontend to backend.', estimatedHours: 5 },
    { id: 'fs4', title: 'Docker & Deployment', description: 'Containerize your full-stack app and deploy using Docker Compose.', estimatedHours: 4 },
    { id: 'fs5', title: 'CI/CD Pipeline', description: 'Set up automated builds and deployment with GitHub Actions.', estimatedHours: 3 },
  ],
  'Data Scientist': [
    { id: 'd1', title: 'Python for Data Science', description: 'Master Python, NumPy, and Pandas for data manipulation.', estimatedHours: 6 },
    { id: 'd2', title: 'Exploratory Data Analysis', description: 'Use Matplotlib and Seaborn to visualize datasets.', estimatedHours: 4 },
    { id: 'd3', title: 'Machine Learning Basics', description: 'Build classification and regression models with scikit-learn.', estimatedHours: 8 },
    { id: 'd4', title: 'Feature Engineering', description: 'Clean raw data, handle missing values, and engineer features.', estimatedHours: 4 },
    { id: 'd5', title: 'Deep Learning with TensorFlow', description: 'Build neural networks and deploy models using TensorFlow/Keras.', estimatedHours: 8 },
  ],
};

const QUICK_TOPICS = ['Python', 'SQL', 'JavaScript', 'React', 'Java', 'Docker', 'Machine Learning', 'TypeScript', 'Kubernetes', 'AWS', 'GraphQL', 'MongoDB'];
const STORAGE_KEY = 'learnpilot_roadmap_history';
const ACTIVE_KEY  = 'learnpilot_active_roadmap';

const loadHistory = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; } };
const saveHistory = (h)  => localStorage.setItem(STORAGE_KEY, JSON.stringify(h));

// Build W3Schools URL for a step title
const getW3SchoolsUrl = (stepTitle) => {
  const t = stepTitle.toLowerCase();
  if (t.includes('html') || t.includes('css'))       return 'https://www.w3schools.com/html/';
  if (t.includes('javascript') || t.includes('js'))  return 'https://www.w3schools.com/js/';
  if (t.includes('react'))                           return 'https://www.w3schools.com/react/';
  if (t.includes('python'))                          return 'https://www.w3schools.com/python/';
  if (t.includes('sql'))                             return 'https://www.w3schools.com/sql/';
  if (t.includes('java') && !t.includes('javascript')) return 'https://www.w3schools.com/java/';
  if (t.includes('typescript'))                      return 'https://www.w3schools.com/typescript/';
  if (t.includes('node'))                            return 'https://www.w3schools.com/nodejs/';
  if (t.includes('php'))                             return 'https://www.w3schools.com/php/';
  if (t.includes('c++') || t.includes('cpp'))        return 'https://www.w3schools.com/cpp/';
  if (t.includes('c#') || t.includes('csharp'))      return 'https://www.w3schools.com/cs/';
  if (t.includes('django'))                          return 'https://www.w3schools.com/django/';
  if (t.includes('bootstrap'))                       return 'https://www.w3schools.com/bootstrap5/';
  if (t.includes('mongodb'))                         return 'https://www.w3schools.com/mongodb/';
  if (t.includes('xml'))                             return 'https://www.w3schools.com/xml/';
  if (t.includes('json'))                            return 'https://www.w3schools.com/js/js_json_intro.asp';
  if (t.includes('git'))                             return 'https://www.w3schools.com/git/';
  if (t.includes('machine learning') || t.includes('ml')) return 'https://www.w3schools.com/python/python_ml_getting_started.asp';
  if (t.includes('pandas'))                          return 'https://www.w3schools.com/python/pandas/default.asp';
  if (t.includes('numpy'))                           return 'https://www.w3schools.com/python/numpy/default.asp';
  if (t.includes('scipy'))                           return 'https://www.w3schools.com/python/scipy/index.php';
  if (t.includes('data'))                            return 'https://www.w3schools.com/python/pandas/default.asp';
  if (t.includes('spring'))                          return 'https://www.w3schools.com/spring/index.php';
  // fallback: W3Schools search
  return `https://www.w3schools.com/search/search_result.php?search=${encodeURIComponent(stepTitle)}`;
};

// ── RoadmapStep ──────────────────────────────────────────────
const RoadmapStep = ({ step, index, total, completedIds, onToggle }) => {
  const [expanded, setExpanded] = useState(false);
  const done = completedIds.includes(step.id);
  const w3url = getW3SchoolsUrl(step.title);

  return (
    <div className="relative flex gap-3">
      {index < total - 1 && <div className="absolute left-4 top-9 w-0.5 h-full bg-slate-200 z-0" />}

      {/* Status indicator circle (non-interactive) */}
      <div className={`relative z-10 flex items-center justify-center w-8 h-8 mt-1 rounded-full border-2 border-white shrink-0 shadow-sm text-xs font-bold
        ${done ? 'bg-primary-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
        {done ? <CheckCircle className="w-4 h-4" /> : index + 1}
      </div>

      {/* Card */}
      <div className={`flex-1 mb-4 rounded-xl border shadow-sm transition-all
        ${done ? 'bg-green-50 border-green-200' : 'bg-white border-slate-100 hover:border-primary-200 hover:shadow-md'}`}>

        {/* Card header — click to expand */}
        <div className="flex items-start justify-between p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-sm ${done ? 'text-green-800 line-through' : 'text-slate-800'}`}>{step.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{step.description}</p>
          </div>
          <div className="flex items-center gap-2 ml-2 shrink-0">
            <span className="flex items-center text-xs text-slate-400"><Clock className="w-3 h-3 mr-0.5" />{step.estimatedHours}h</span>
            {expanded ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
          </div>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-3">
            <p className="text-xs text-slate-600">{step.description}</p>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* W3Schools link */}
              <a
                href={w3url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                <ExternalLink className="w-3 h-3" /> Learn on W3Schools
              </a>

              {/* Mark Complete / Undo button */}
              <button
                onClick={e => { e.stopPropagation(); onToggle(step.id); }}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition
                  ${done
                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                  }`}
              >
                <CheckCircle className="w-3 h-3" />
                {done ? 'Mark Incomplete' : 'Mark as Complete'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── ActiveRoadmapView ────────────────────────────────────────
const ActiveRoadmapView = ({ roadmap }) => {
  const [completedIds, setCompletedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`${roadmap.id}_completed`) || '[]'); } catch { return []; }
  });

  useEffect(() => {
    setCompletedIds(() => {
      try { return JSON.parse(localStorage.getItem(`${roadmap.id}_completed`) || '[]'); } catch { return []; }
    });
  }, [roadmap.id]);

  const toggle = (id) => {
    setCompletedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem(`${roadmap.id}_completed`, JSON.stringify(next));
      return next;
    });
  };

  const steps = roadmap.steps || [];
  const doneCount = completedIds.filter(id => steps.find(s => s.id === id)).length;
  const pct = steps.length ? Math.round((doneCount / steps.length) * 100) : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Play className="w-3 h-3" /> Current Learning
          </span>
          <span className="text-xs text-slate-500">{doneCount}/{steps.length} steps</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Roadmap: <span className="text-primary-600">{roadmap.topic}</span>
        </h2>
        {roadmap.description && <p className="text-slate-500 text-xs mt-1">{roadmap.description}</p>}
        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Progress</span><span>{pct}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 transition-all duration-500 rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>
      {/* Steps — scrollable */}
      <div className="flex-1 overflow-y-auto pr-1 ml-1">
        {steps.map((step, i) => (
          <RoadmapStep key={step.id || i}
            step={{ ...step, estimatedHours: step.estimatedHours || 4 }}
            index={i} total={steps.length}
            completedIds={completedIds} onToggle={toggle} />
        ))}
      </div>
    </div>
  );
};

// ── Main Learning Component ──────────────────────────────────
const Learning = () => {
  const [careerGoal, setCareerGoal]     = useState('Backend Developer');
  const [loadingProfile, setLoading]    = useState(true);
  const [customTopic, setCustomTopic]   = useState('');
  const [generating, setGenerating]     = useState(false);
  const [genError, setGenError]         = useState('');
  const [history, setHistory]           = useState(loadHistory);
  const [activeRoadmap, setActiveRoadmap] = useState(() => {
    try { return JSON.parse(localStorage.getItem(ACTIVE_KEY) || 'null'); } catch { return null; }
  });

  useEffect(() => {
    const email = localStorage.getItem('studentEmail');
    if (!email) { setCareerGoal(localStorage.getItem('careerGoal') || 'Backend Developer'); setLoading(false); return; }
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/students/profile?email=${encodeURIComponent(email)}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setCareerGoal(d?.careerGoal || localStorage.getItem('careerGoal') || 'Backend Developer'))
      .catch(() => setCareerGoal(localStorage.getItem('careerGoal') || 'Backend Developer'))
      .finally(() => setLoading(false));
  }, []);

  const setActive = useCallback((roadmap) => {
    setActiveRoadmap(roadmap);
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(roadmap));
  }, []);

  const deleteFromHistory = (id) => {
    setHistory(prev => { const n = prev.filter(r => r.id !== id); saveHistory(n); return n; });
    setActiveRoadmap(prev => { if (prev?.id === id) { localStorage.removeItem(ACTIVE_KEY); return null; } return prev; });
  };

  const generateRoadmap = async (topic = customTopic) => {
    const t = topic.trim(); if (!t) return;
    setGenerating(true); setGenError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/learning/generate-roadmap`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: t }),
      });
      if (res.ok) {
        const data = await res.json();
        const roadmap = { ...data, id: `${t}-${Date.now()}`, generatedAt: new Date().toLocaleString() };
        setHistory(prev => {
          const filtered = prev.filter(r => r.topic?.toLowerCase() !== t.toLowerCase());
          const next = [roadmap, ...filtered].slice(0, 20);
          saveHistory(next); return next;
        });
        setActive(roadmap);
        setCustomTopic(t);
      } else { setGenError('Failed to generate. Try again.'); }
    } catch { setGenError('Cannot connect to server.'); }
    finally { setGenerating(false); }
  };

  const careerTopics  = CAREER_ROADMAPS[careerGoal] || CAREER_ROADMAPS['Backend Developer'];
  const careerRoadmap = {
    id: `career-${careerGoal}`,
    topic: careerGoal,
    description: `Your personalized roadmap to become a ${careerGoal}.`,
    steps: careerTopics.map(t => ({ ...t, resources: ['Official Docs', 'YouTube Tutorials', 'Practice Projects'] })),
  };
  const displayed = activeRoadmap || careerRoadmap;

  if (loadingProfile) return (
    <div className="flex items-center justify-center h-64">
      <Loader className="w-8 h-8 text-primary-500 animate-spin" />
    </div>
  );

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">

      {/* ── LEFT SIDEBAR ─────────────────────────────────── */}
      <div className="w-80 shrink-0 flex flex-col gap-4 overflow-y-auto">

        {/* Generator Card */}
        <div className="bg-gradient-to-b from-primary-50 to-white border border-primary-100 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-primary-500 p-1.5 rounded-lg"><Sparkles className="w-4 h-4 text-white" /></div>
            <h2 className="font-bold text-slate-900 text-sm">Generate Roadmap</h2>
          </div>
          {/* Quick chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {QUICK_TOPICS.map(t => (
              <button key={t} onClick={() => { setCustomTopic(t); generateRoadmap(t); }}
                className="text-xs px-2.5 py-1 rounded-full bg-white border border-primary-200 text-primary-700 hover:bg-primary-500 hover:text-white hover:border-primary-500 transition font-medium">
                {t}
              </button>
            ))}
          </div>
          {/* Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input type="text" value={customTopic}
                onChange={e => setCustomTopic(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && generateRoadmap()}
                placeholder="Any topic..."
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white" />
            </div>
            <button onClick={() => generateRoadmap()} disabled={generating || !customTopic.trim()}
              className="flex items-center justify-center w-9 h-9 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 shrink-0">
              {generating ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
          {genError && <p className="text-red-500 text-xs mt-2">{genError}</p>}
        </div>

        {/* My Saved Roadmaps */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
            <History className="w-4 h-4 text-slate-500" />
            <span className="font-semibold text-slate-800 text-sm">My Roadmaps</span>
            {history.length > 0 && (
              <span className="bg-primary-100 text-primary-700 text-xs font-bold px-1.5 py-0.5 rounded-full ml-auto">{history.length}</span>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {/* Career roadmap entry */}
            <button onClick={() => { setActiveRoadmap(null); localStorage.removeItem(ACTIVE_KEY); }}
              className={`w-full flex items-center gap-2 px-4 py-3 text-left transition border-b border-slate-50
                ${!activeRoadmap ? 'bg-primary-50' : 'hover:bg-slate-50'}`}>
              <div className={`w-2 h-2 rounded-full shrink-0 ${!activeRoadmap ? 'bg-primary-500' : 'bg-slate-300'}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${!activeRoadmap ? 'text-primary-700' : 'text-slate-700'}`}>{careerGoal}</p>
                <p className="text-xs text-slate-400">Career goal · {careerTopics.length} steps</p>
              </div>
              {!activeRoadmap && <span className="text-xs text-primary-600 font-semibold shrink-0">Active</span>}
            </button>

            {history.length === 0 && (
              <div className="px-4 py-6 text-center text-slate-400 text-xs">
                <Sparkles className="w-6 h-6 mx-auto mb-2 opacity-40" />
                Generate a roadmap to see it here
              </div>
            )}

            {history.map(r => {
              const isActive = activeRoadmap?.id === r.id;
              return (
                <div key={r.id} className={`flex items-center gap-2 px-4 py-3 border-b border-slate-50 transition group
                  ${isActive ? 'bg-primary-50' : 'hover:bg-slate-50'}`}>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-primary-500' : 'bg-slate-300'}`} />
                  <button onClick={() => setActive(r)} className="flex-1 min-w-0 text-left">
                    <p className={`text-sm font-medium truncate ${isActive ? 'text-primary-700' : 'text-slate-700'}`}>{r.topic}</p>
                    <p className="text-xs text-slate-400">{r.steps?.length || 0} steps · {r.generatedAt}</p>
                  </button>
                  <div className="flex items-center gap-1 shrink-0">
                    {isActive && <span className="text-xs text-primary-600 font-semibold">Active</span>}
                    <button onClick={() => deleteFromHistory(r.id)}
                      className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition rounded">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── RIGHT: ACTIVE ROADMAP ─────────────────────────── */}
      <div className="flex-1 bg-white border border-slate-100 rounded-2xl shadow-sm p-6 overflow-hidden flex flex-col">
        <ActiveRoadmapView roadmap={displayed} />
      </div>

    </div>
  );
};

export default Learning;
