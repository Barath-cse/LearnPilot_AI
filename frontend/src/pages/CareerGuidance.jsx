import React, { useState, useEffect } from 'react';
import { Compass, Award, Lightbulb, Banknote, Loader2, ExternalLink, Upload, FileText, CheckCircle } from 'lucide-react';

// ── Career data map ──────────────────────────────────────────
const CAREER_DATA = {
  'Frontend Developer': {
    title: 'Frontend Developer',
    skills: ['React.js', 'TypeScript', 'CSS Grid / Flexbox', 'REST APIs', 'Web Accessibility', 'Performance Optimization'],
    salary: '₹4–10 LPA (India) · $70,000–$110,000 (Global). Strong demand in product-based companies and startups.',
    projects: [
      { title: 'Portfolio Website', description: 'A responsive personal portfolio with animations, dark mode, and a contact form.', stack: ['React', 'TailwindCSS', 'Framer Motion'] },
      { title: 'E-Commerce UI', description: 'A full shopping cart UI with product filtering, search, and checkout flow.', stack: ['React', 'Redux', 'REST API'] },
      { title: 'Real-Time Dashboard', description: 'A live analytics dashboard consuming WebSocket data with interactive charts.', stack: ['React', 'Chart.js', 'WebSocket'] },
    ],
    certifications: [
      { name: 'Meta Frontend Developer Certificate', url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer' },
      { name: 'Google UX Design Certificate', url: 'https://www.coursera.org/professional-certificates/google-ux-design' },
      { name: 'JavaScript Algorithms – freeCodeCamp', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/' },
      { name: 'React – Scrimba', url: 'https://scrimba.com/learn/learnreact' },
    ],
  },
  'Backend Developer': {
    title: 'Backend Developer',
    skills: ['Spring Boot', 'REST API Design', 'Docker', 'AWS / Cloud', 'Microservices', 'SQL & NoSQL DBs'],
    salary: '₹5–14 LPA (India) · $80,000–$130,000 (Global). High demand in fintech, healthcare, and enterprise software.',
    projects: [
      { title: 'JWT Auth API', description: 'A secure REST API with user registration, login, role-based access, and refresh tokens.', stack: ['Java', 'Spring Boot', 'MongoDB'] },
      { title: 'Inventory Management System', description: 'CRUD REST API with pagination, filtering, and PDF report generation.', stack: ['Spring Boot', 'PostgreSQL', 'Docker'] },
      { title: 'Microservices E-Commerce', description: 'Distributed system with order, payment, and inventory services communicating via Kafka.', stack: ['Spring Cloud', 'Kafka', 'Redis'] },
    ],
    certifications: [
      { name: 'AWS Certified Developer – Associate', url: 'https://aws.amazon.com/certification/certified-developer-associate/' },
      { name: 'Oracle Certified Java SE 17 Developer', url: 'https://education.oracle.com/java-se-17-developer/pexam_1Z0-829' },
      { name: 'Spring Framework – Udemy (Chad Darby)', url: 'https://www.udemy.com/course/spring-hibernate-tutorial/' },
      { name: 'Docker & Kubernetes – KodeKloud', url: 'https://kodekloud.com/courses/docker-for-the-absolute-beginner/' },
    ],
  },
  'Full Stack Developer': {
    title: 'Full Stack Developer',
    skills: ['React.js', 'Spring Boot / Node.js', 'MongoDB & PostgreSQL', 'Docker', 'CI/CD (GitHub Actions)', 'JWT Auth'],
    salary: '₹6–18 LPA (India) · $90,000–$140,000 (Global). One of the highest-demand roles in modern software companies.',
    projects: [
      { title: 'Full-Stack Task Manager', description: 'React frontend + Spring Boot backend with JWT auth, real-time updates, and deployment on Render.', stack: ['React', 'Spring Boot', 'MongoDB', 'Docker'] },
      { title: 'Blog CMS Platform', description: 'WYSIWYG editor, image upload (Cloudinary), comments, and admin dashboard.', stack: ['React', 'Node.js', 'PostgreSQL'] },
      { title: 'Real-Time Chat App', description: 'WebSocket-based group and private messaging with authentication and message history.', stack: ['React', 'Spring Boot', 'WebSocket', 'MongoDB'] },
    ],
    certifications: [
      { name: 'Meta Full-Stack Developer Certificate', url: 'https://www.coursera.org/professional-certificates/meta-back-end-developer' },
      { name: 'AWS Certified Developer – Associate', url: 'https://aws.amazon.com/certification/certified-developer-associate/' },
      { name: 'The Odin Project (Free Full-Stack Curriculum)', url: 'https://www.theodinproject.com/' },
      { name: 'Full-Stack Open – University of Helsinki', url: 'https://fullstackopen.com/en/' },
    ],
  },
  'Data Scientist': {
    title: 'Data Scientist',
    skills: ['Python (Pandas, NumPy)', 'Machine Learning (scikit-learn)', 'Deep Learning (TensorFlow / PyTorch)', 'SQL', 'Data Visualization', 'Statistics & Probability'],
    salary: '₹6–20 LPA (India) · $95,000–$150,000 (Global). Booming demand in AI, finance, healthcare, and e-commerce.',
    projects: [
      { title: 'Customer Churn Predictor', description: 'ML model to predict customer churn using historical data with 87%+ accuracy, deployed as a Flask API.', stack: ['Python', 'scikit-learn', 'Flask', 'Pandas'] },
      { title: 'Sales Forecasting Dashboard', description: 'Time-series forecasting using ARIMA/Prophet with an interactive Streamlit dashboard.', stack: ['Python', 'Prophet', 'Streamlit', 'Plotly'] },
      { title: 'Sentiment Analysis Engine', description: 'NLP model trained on product reviews to classify sentiment, with a REST API endpoint.', stack: ['Python', 'BERT', 'FastAPI', 'HuggingFace'] },
    ],
    certifications: [
      { name: 'IBM Data Science Professional Certificate', url: 'https://www.coursera.org/professional-certificates/ibm-data-science' },
      { name: 'Google Advanced Data Analytics Certificate', url: 'https://www.coursera.org/professional-certificates/google-advanced-data-analytics' },
      { name: 'DeepLearning.AI – Machine Learning Specialization', url: 'https://www.coursera.org/specializations/machine-learning-introduction' },
      { name: 'Kaggle – Intro to ML (Free)', url: 'https://www.kaggle.com/learn/intro-to-machine-learning' },
    ],
  },
};

const DEFAULT_DATA = CAREER_DATA['Backend Developer'];

// ── Resume skill extractor (simple keyword match) ───────────
const extractSkillsFromResume = (text) => {
  const known = ['python', 'java', 'javascript', 'react', 'sql', 'mongodb', 'docker', 'aws',
    'spring', 'node', 'typescript', 'css', 'html', 'git', 'machine learning', 'tensorflow',
    'pandas', 'numpy', 'flask', 'fastapi', 'kafka', 'redis', 'postgresql', 'mysql'];
  const lower = text.toLowerCase();
  return known.filter(s => lower.includes(s)).map(s => s.charAt(0).toUpperCase() + s.slice(1));
};

// ── Main Component ───────────────────────────────────────────
const CareerGuidance = () => {
  const [loading, setLoading]         = useState(true);
  const [student, setStudent]         = useState(null);
  const [resumeSkills, setResumeSkills] = useState([]);
  const [resumeName, setResumeName]   = useState('');
  const [resumeUploaded, setResumeUploaded] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('studentEmail');
    if (!email) { setLoading(false); return; }
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/students/profile?email=${encodeURIComponent(email)}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setStudent(d); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const skills = extractSkillsFromResume(text);
      setResumeSkills(skills);
      setResumeUploaded(true);
    };
    reader.readAsText(file);
  };

  const careerGoal = student?.careerGoal || localStorage.getItem('careerGoal') || 'Backend Developer';
  const data = CAREER_DATA[careerGoal] || DEFAULT_DATA;

  // Merge resume skills into the skills gap analysis
  const missingSkills = data.skills.filter(
    s => !resumeSkills.map(r => r.toLowerCase()).includes(s.toLowerCase())
  );
  const matchedSkills = data.skills.filter(
    s => resumeSkills.map(r => r.toLowerCase()).includes(s.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Analyzing your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Career Guidance</h1>
        <p className="text-slate-600 mt-1">
          Personalized recommendations for <span className="font-semibold text-primary-600">{careerGoal}</span> based on your profile.
        </p>
      </div>

      {/* ── Hero banner ── */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-3xl p-8 text-white shadow-lg flex items-center justify-between">
        <div>
          <p className="text-primary-100 font-medium mb-1">Your Target Role</p>
          <h2 className="text-3xl font-bold">{data.title}</h2>
          {student?.name && <p className="text-primary-200 mt-1 text-sm">Hi {student.name.split(' ')[0]}, here's your personalized guidance ✨</p>}
        </div>
        <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm hidden md:block">
          <Compass className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* ── Resume Upload ── */}
      <div className="bg-white border border-dashed border-primary-300 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-primary-50 text-primary-600 rounded-lg"><FileText className="w-5 h-5" /></div>
          <div>
            <h3 className="font-bold text-slate-900">Upload Your Resume</h3>
            <p className="text-xs text-slate-500">We'll detect your skills and show what you still need to learn</p>
          </div>
        </div>
        <label className="cursor-pointer">
          <input type="file" accept=".txt,.pdf" onChange={handleResumeUpload} className="hidden" />
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition">
              <Upload className="w-4 h-4" /> {resumeUploaded ? 'Re-upload Resume' : 'Upload Resume (.txt)'}
            </span>
            {resumeUploaded && (
              <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                <CheckCircle className="w-4 h-4" /> {resumeName} — {resumeSkills.length} skills detected
              </span>
            )}
          </div>
        </label>
        {resumeUploaded && resumeSkills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {resumeSkills.map(s => (
              <span key={s} className="text-xs px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full font-medium">✓ {s}</span>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ── Skills Gap ── */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Lightbulb className="w-5 h-5" /></div>
            <h3 className="font-bold text-lg text-slate-900">Skills to Acquire</h3>
          </div>
          {resumeUploaded ? (
            <div className="space-y-3">
              {matchedSkills.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-green-600 uppercase mb-2">Already have ✓</p>
                  <div className="flex flex-wrap gap-2">
                    {matchedSkills.map(s => <span key={s} className="text-xs px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 rounded-lg font-medium">{s}</span>)}
                  </div>
                </div>
              )}
              {missingSkills.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-orange-500 uppercase mb-2">Still need to learn</p>
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.map(s => <span key={s} className="text-xs px-2.5 py-1 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg font-medium">{s}</span>)}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.skills.map(skill => (
                <span key={skill} className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium">{skill}</span>
              ))}
            </div>
          )}
        </div>

        {/* ── Market Insights ── */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Banknote className="w-5 h-5" /></div>
            <h3 className="font-bold text-lg text-slate-900">Market Insights</h3>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed">{data.salary}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ── Recommended Projects ── */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-lg text-slate-900 mb-4 border-b border-slate-100 pb-2">
            🚀 Must-Build Projects
          </h3>
          <div className="space-y-4">
            {data.projects.map((proj, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary-200 transition">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-bold text-slate-900 text-sm">{proj.title}</h4>
                  <span className="text-xs text-primary-600 font-semibold shrink-0 ml-2">Project {idx + 1}</span>
                </div>
                <p className="text-xs text-slate-600 mb-3">{proj.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {proj.stack.map(tech => (
                    <span key={tech} className="text-xs px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-500">{tech}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Certifications ── */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
          <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-2">
            <Award className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-lg text-slate-900">Must-Earn Certifications</h3>
          </div>
          <ul className="space-y-3">
            {data.certifications.map((cert, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
                <a href={cert.url} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-slate-700 hover:text-primary-600 hover:underline transition flex items-center gap-1 group">
                  {cert.name}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CareerGuidance;
