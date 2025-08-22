import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import KnowledgeBase from './pages/KnowledgeBase.jsx';
import Admin from './pages/Admin.jsx';

function Navbar(){
  return (
    <header className="bg-indigo-600 text-white shadow">
      <div className="max-w-6xl mx-auto flex justify-between p-4">
        <div className="font-bold">Wexa AI Helpdesk</div>
        <nav className="space-x-4">
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/kb">Knowledge Base</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>
      </div>
    </header>
  )
}

export default function App(){
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kb" element={<KnowledgeBase />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  )
}
