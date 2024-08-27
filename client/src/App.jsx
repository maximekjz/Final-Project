import { useState } from 'react'
import {Routes, Route} from 'react-router-dom'
import './App.css'
import LoginRegister from './components/LoginRegister'
import Home from './components/Home'
import Header from './components/Header'

function App() {
  

  return (
    <>
      <Header />
      <Routes>
        <Route path = '/' element={<Home/>}/>
        <Route path = '/login' element={<LoginRegister title={"Login"}/>}/>
        <Route path = '/register' element={<LoginRegister title={"Register"}/>}/>
      </Routes>
    </>
  )
}

export default App
