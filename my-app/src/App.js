import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import './App.css';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Chat } from './pages/Chat';
import { SetAvatar } from './pages/SetAvatar';

function App() {
  return (
    <div className="App">
       <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/" element={<Chat/>} />
          <Route path='/setAvatar' element={<SetAvatar/>} />
        </Routes>
        
       </BrowserRouter>
    </div>
  );
}

export default App;
