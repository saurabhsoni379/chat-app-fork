import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { SetAvatar } from './pages/SetAvatar';
import Layout from './components/Layout';
import Profile from './components/Profile';
import Friends from './components/Friends';
import { Chat } from './pages/Chat';

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const checkUser = () => {
      const user = JSON.parse(localStorage.getItem('chat-app-user'));
      setCurrentUser(user);
    };
    
    checkUser();
    
    // Listen for storage events to handle login/register from other tabs
    window.addEventListener('storage', checkUser);
    
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setAvatar" element={<SetAvatar />} />
        <Route
          path="/"
          element={
            currentUser ? (
              <Layout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route path="profile" element={<Profile user={currentUser} />} />
          <Route path="friends" element={<Friends currentUser={currentUser} />} />
          <Route path="chat" element={<Chat currentUser={currentUser} />} />
          <Route index element={<Navigate to="chat" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
