import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import LoginRegister from './assets/components/LoginRegister';
import Home from './assets/components/Home';
import Header from './assets/components/Header' 
import Data from './assets/components/Data';
import GameExplanation from './assets/components/GameExplanation';
import LeagueManager from './assets/components/LeagueManager';
import TeamManager from './assets/components/TeamManager';
import Logout from './assets/components/Logout';
import Auth from './assets/components/Auth';

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginRegister title="Login" />} />
        <Route path="/register" element={<LoginRegister title="Register" />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/league" element={<Auth><LeagueManager /></Auth>}/>
        <Route path="/data" element={<Data />} />
        <Route path="/game" element={<GameExplanation />} />
        <Route path="/team" element={<Auth><TeamManager /></Auth>} />
      </Routes>
    </>
  );
};

export default App;

