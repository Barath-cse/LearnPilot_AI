import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Code, Trophy, Target, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary-600 flex items-center gap-2">
          <BookOpen className="h-8 w-8" />
          LearnPilot AI
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium">Login</Link>
          <Link to="/register" className="bg-primary-600 text-white px-6 py-2 rounded-full font-medium hover:bg-primary-700 transition">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
            An Autonomous Learning & <br/> <span className="text-primary-600">Placement Coach</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Powered by collaborative AI agents to help you learn programming, practice coding, and land your dream tech job.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="bg-primary-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-primary-700 transition flex items-center gap-2 shadow-lg shadow-primary-500/30">
              Start Learning Now <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Multi-Agent Intelligence</h2>
            <p className="text-slate-600">Our specialized AI agents work together to accelerate your career.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Personal Tutor Agent', icon: <Target className="h-10 w-10 text-blue-500" />, desc: 'Creates dynamic roadmaps and orchestrates your learning journey.' },
              { title: 'Coding Mentor Agent', icon: <Code className="h-10 w-10 text-green-500" />, desc: 'Reviews your code, detects bugs, and suggests optimal solutions.' },
              { title: 'Placement Agent', icon: <Trophy className="h-10 w-10 text-purple-500" />, desc: 'Conducts mock interviews and provides actionable feedback.' }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
