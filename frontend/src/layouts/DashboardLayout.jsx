import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, BookOpen, Code, FileQuestion, Briefcase, Compass, LogOut } from 'lucide-react';

const DashboardLayout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Learning', path: '/dashboard/learning', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Quizzes', path: '/dashboard/quizzes', icon: <FileQuestion className="w-5 h-5" /> },
    { name: 'Placement', path: '/dashboard/placement', icon: <Briefcase className="w-5 h-5" /> },
    { name: 'Career Guidance', path: '/dashboard/career', icon: <Compass className="w-5 h-5" /> },
    { name: 'Profile', path: '/dashboard/profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <Link to="/" className="text-xl font-bold text-primary-600 flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            LearnPilot
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 md:hidden">
          <div className="text-xl font-bold text-primary-600">LearnPilot</div>
        </header>
        <div className="p-8 flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
