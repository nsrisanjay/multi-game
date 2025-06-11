import React, { useState } from 'react'
import { auth } from '../auth/auth';
import { publicApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Signin() {
    const navigate = useNavigate();
    let [details,setDetails] = useState({username:"",password:""});
    let [error,setError] = useState("");
    const setToken  = auth.setToken;
    async function handleSubmit(e:React.FormEvent)
    {
        e.preventDefault();
        setError("");
        try{
            const res:any = await publicApi.post('/signin',details);
            if(res.status ===403)
            {
                setError("Invalid credentials");
            }
            if(res.status===200 && res.data.token)
            {
                setToken(res.data.token);
                console.log("Logged in!!!!");
                navigate("/dashboard");
            }
            else{
                setError("Invalid credentials");
            }
        }
        catch(err:any)
        {
            console.log(err);
            setError("Login Failed"+err);
        }
    }
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded shadow-md w-full max-w-sm"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

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
                    Sign In
                </button>
            </form>
        </div>
  )
}

export default Signin;