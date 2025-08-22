import React from 'react';
import { motion } from 'framer-motion';

const tickets = [
  { id: 1, subject: "Email not working", status: "Pending", confidence: 0.82 },
  { id: 2, subject: "Laptop crashed", status: "Resolved", confidence: 0.95 },
  { id: 3, subject: "VPN issue", status: "Urgent", confidence: 0.60 },
];

export default function Dashboard(){
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Tickets Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tickets.map((t, i)=>(
          <motion.div key={t.id} initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold text-lg">{t.subject}</h3>
            <p className="text-gray-500 text-sm">Ticket #{t.id}</p>
            <div className="flex justify-between mt-3">
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">{t.status}</span>
              <span className="text-xs text-gray-400">Conf: {t.confidence}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
