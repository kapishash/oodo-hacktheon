import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import HomePage from './components/HomePage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import {
    BrowserRouter as Router,
    Routes,
    Route
  } from 'react-router-dom'
import ProfilePage from './pages/ProfilePage.jsx'

function App() {
  
  return (
    <>
    
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />

    </Routes>
    </>
  )
  


}

export default App
