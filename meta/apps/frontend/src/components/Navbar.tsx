import React from 'react';
import { auth } from '../auth/auth';
import { useNavigate } from 'react-router-dom';
export default function Navbar() {
  const navigate = useNavigate();
  const removeToken = auth.removeToken;
   const handleLogout = () => {
    removeToken();
    navigate('/signin');
  };
  return (
    <div className=" h-16 bg-white shadow-md flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold">Work Sphere</h1>
      </div>
        <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
