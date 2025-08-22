import React from 'react';
import { motion } from 'framer-motion';

const articles = [
  { id: 1, title: "Reset password", category: "Account" },
  { id: 2, title: "Setup VPN", category: "Network" },
  { id: 3, title: "Email troubleshooting", category: "Communication" },
];

export default function KnowledgeBase(){
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Knowledge Base</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((a,i)=>(
          <motion.div key={a.id} initial={{opacity:0,scale:0.95}} whileInView={{opacity:1,scale:1}} className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold">{a.title}</h3>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">{a.category}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
