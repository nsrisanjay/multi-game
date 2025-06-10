import React, { useState } from 'react';
import { publicApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [details, setDetails] = useState({ username: "", password: "", type: "user" });
    const [error, setError] = useState("");
    // const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        try {
            const res = await publicApi.post('/signup', details);
            if (res.status === 200) {
                alert('Signup successful');
                // navigate('/login');
            } else {
                setError('Signup failed');
            }
        } catch (err: any) {
            console.error(err);
            setError("Signup failed: " + err.message);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-full max-w-sm"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

                <div className="mb-4">
                    <label
                        htmlFor="username"
                        className="block text-gray-700 font-semibold mb-2"
                    >
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={details.username}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="password"
                        className="block text-gray-700 font-semibold mb-2"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={details.password}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {error && (
                    <p className="mb-4 text-red-600 font-medium text-center">{error}</p>
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
}

export default Signup;
