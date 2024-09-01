// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import LoginRegister from './assets/components/LoginRegister';
import Home from './assets/components/Home';
import Header from './assets/components/Header' 
import Dashboard from './assets/components/Dashboard';
import Data from './assets/components/Data';
import GameExplanation from './assets/components/GameExplanation';
import LeagueManager from './assets/components/LeagueManager';

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginRegister title="Login" />} />
        <Route path="/register" element={<LoginRegister title="Register" />} />
        <Route path="/dash" element={<Dashboard />} />
        <Route path="/league" element={<LeagueManager />} />
        <Route path="/data" element={<Data />} />
        <Route path="/game" element={<GameExplanation />} />
      </Routes>
    </>
  );
};

export default App;
