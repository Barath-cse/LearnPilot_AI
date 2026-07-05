import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Code, Trophy, Target, TrendingUp, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
  >
    <div className={`p-4 rounded-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem('studentEmail');
    if (!email) { setLoading(false); return; }

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/students/profile?email=${encodeURIComponent(email)}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setStudent(data);
          // Fetch dynamic AI recommendations from Career API
          return fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/career/recommendations?studentId=${data.id || email}`);
        }
      })
      .then(res => res ? res.json() : null)
      .then(careerData => {
        if (careerData && careerData.recommendedProjects) {
          const formattedRecs = careerData.recommendedProjects.map(proj => ({
            title: proj.title,
            desc: proj.description
          }));
          setRecommendations(formattedRecs);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const firstName = student?.name?.split(' ')[0] || localStorage.getItem('studentEmail')?.split('@')[0] || 'Student';
  const careerGoal = student?.careerGoal || localStorage.getItem('careerGoal') || 'Your Career';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {firstName}! 👋</h1>
        <p className="text-slate-600 mt-1">
          Your career goal: <span className="font-semibold text-primary-600">{careerGoal}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Learning Progress"
          value={student ? "0%" : "—"}
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
          color="bg-blue-50"
        />
        <StatCard
          title="Coding Score"
          value={student ? "0" : "—"}
          icon={<Code className="w-6 h-6 text-green-600" />}
          color="bg-green-50"
        />
        <StatCard
          title="Quiz Accuracy"
          value={student ? "0%" : "—"}
          icon={<Target className="w-6 h-6 text-purple-600" />}
          color="bg-purple-50"
        />
        <StatCard
          title="Interview Score"
          value={student ? "0/100" : "—"}
          icon={<Trophy className="w-6 h-6 text-orange-600" />}
          color="bg-orange-50"
        />
      </div>

      {/* AI Recommendations */}
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">AI Recommendations for <span className="text-primary-600">{careerGoal}</span></h2>
          <span className="text-sm text-primary-600 bg-primary-50 px-3 py-1 rounded-full font-medium">Personalized</span>
        </div>
        <div className="space-y-4">
          {recommendations.length > 0 ? recommendations.map((rec, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm h-fit">
                {idx % 2 === 0 ? <BookOpen className="w-6 h-6 text-primary-500" /> : <Code className="w-6 h-6 text-primary-500" />}
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">{rec.title}</h4>
                <p className="text-sm text-slate-600 mt-1">{rec.desc}</p>
                <Link to="/dashboard/learning" className="text-primary-600 text-sm font-medium mt-2 hover:underline inline-block">
                  Start Now →
                </Link>
              </div>
            </div>
          )) : (
            <div className="p-4 text-center text-slate-500">
              Generating dynamic AI recommendations...
            </div>
          )}
        </div>
      </div>

      {!student && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
          <p className="text-amber-700 font-medium">Complete your <Link to="/dashboard/profile" className="underline">profile</Link> to get personalized AI recommendations!</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
