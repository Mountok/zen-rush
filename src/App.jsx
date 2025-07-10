import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Recommendations from './pages/Recommendations';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Navbar from './components/Navbar';
import SplashBanner from './components/SplashBanner';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [hideSplash, setHideSplash] = useState(false);

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => setHideSplash(true), 3000);
      const timer2 = setTimeout(() => setShowSplash(false), 3700);
      return () => { clearTimeout(timer); clearTimeout(timer2); };
    }
  }, [showSplash]);

  return (
    <>
    <BrowserRouter>
      <div className="app-bg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recommendations" element={
            <ProtectedRoute>
              <Recommendations />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
          <Navbar />
      </div>
    </BrowserRouter>
      {showSplash && <SplashBanner hide={hideSplash} />}
    </>
  );
}

export default App;
