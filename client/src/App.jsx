import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Generate from './pages/Generate';
import Scheduler from './pages/Scheduler';
import History from './pages/History';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Help from './pages/Help';

const AppLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isPublicRoute = ['/', '/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen flex bg-dark-bg text-white font-sans">
      {!isPublicRoute && user && <Sidebar />}
      
      <div className={`flex-grow flex flex-col ${!isPublicRoute && user ? 'ml-64' : ''}`}>
        {isPublicRoute && <Navbar />}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/generate" 
              element={
                <ProtectedRoute>
                  <Generate />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/scheduler" 
              element={
                <ProtectedRoute>
                  <Scheduler />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/history" 
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/help" 
              element={
                <ProtectedRoute>
                  <Help />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
