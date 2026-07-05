import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Learning from './pages/Learning';
import TopicDetail from './pages/TopicDetail';
import QuizList from './pages/QuizList';
import QuizSession from './pages/QuizSession';
import QuizResult from './pages/QuizResult';
import PlacementDashboard from './pages/PlacementDashboard';
import InterviewSession from './pages/InterviewSession';
import CareerGuidance from './pages/CareerGuidance';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="learning" element={<Learning />} />
          <Route path="learning/:id" element={<TopicDetail />} />
          <Route path="quizzes" element={<QuizList />} />
          <Route path="quizzes/session" element={<QuizSession />} />
          <Route path="quizzes/result" element={<QuizResult />} />
          <Route path="placement" element={<PlacementDashboard />} />
          <Route path="placement/interview" element={<InterviewSession />} />
          <Route path="career" element={<CareerGuidance />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
