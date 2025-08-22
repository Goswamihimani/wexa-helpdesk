import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = (e)=>{ e.preventDefault(); alert(`Logging in as ${email}`); }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-indigo-700 text-center">Wexa AI Helpdesk</h1>
        <p className="text-center text-gray-500 mb-6">AI-powered support made simple</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Login</button>
        </form>
      </motion.div>
    </div>
  )
}
