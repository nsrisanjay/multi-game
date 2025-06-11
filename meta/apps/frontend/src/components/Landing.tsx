// src/pages/Landing.tsx
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to the App</h1>
      <p className="mb-8">Explore the features or sign in to continue.</p>
      <button
        onClick={() => navigate("/signin")}
        className="px-6 py-2 bg-blue-600 text-white rounded shadow"
      >
        Sign In
      </button>
    </div>
  );
}
