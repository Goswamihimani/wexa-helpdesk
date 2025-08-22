import React from 'react';

export default function Admin(){
  return (
    <div className="flex">
      <aside className="w-64 bg-indigo-600 text-white p-6 min-h-screen">
        <h2 className="font-bold text-xl mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          <a href="#">Dashboard</a>
          <a href="#">Tickets</a>
          <a href="#">Knowledge Base</a>
          <a href="#">Users</a>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Welcome, Admin 👋</h1>
        <p>Manage tickets, users, and knowledge base here.</p>
      </main>
    </div>
  )
}
