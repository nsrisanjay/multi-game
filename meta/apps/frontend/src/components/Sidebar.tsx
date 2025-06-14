import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4 fixed">
      <h2 className="text-xl font-bold mb-6">Sidebar</h2>
      <ul>
        <li><Link to="/dashboard" className="block py-2 hover:bg-gray-700 rounded px-2">Dashboard</Link></li>
        <li><Link to="/profile" className="block py-2 hover:bg-gray-700 rounded px-2">Profile</Link></li>
        {/* Add more links as needed */}
      </ul>
    </div>
  );
}
