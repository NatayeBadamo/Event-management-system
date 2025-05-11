import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";


const Login = () => {
  // State to store user input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();

  // Function to handle login
  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent page reload

    setLoading(true);


    try {
      const response = await axios.post(
        "http://localhost:4000/login", // Update with your actual login endpoint
        { email, password },
        { withCredentials: true } // Allows cookies to be stored for authentication
      );

      console.log("Login successful:", response.data);
      // Redirect user or store authentication state as needed
      window.location.href = "/";
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Login failed. Email ou Mot de passe incorrect");
    }finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-green-600 font font-extrabold">En cours de connexion ...</p>;

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 shadow-md shadow-black mt-16">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Login today!</h1>
        <p className="mt-4 text-gray-500 underline font font-extrabold">Welcome back! Please login.</p>
      </div>

      <form onSubmit={handleLogin} className="mx-auto mt-8 mb-0 max-w-md space-y-4 bg-gray-900 rounded text-white p-5 shadow-md shadow-black">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            type="email"
            className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-xs text-white outline-none"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            type="password"
            className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-xs text-white outline-none"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            No account? <Link className="underline" to="/Signin">Sign up</Link>
          </p>

          <button
            type="submit"
            className="inline-block rounded-lg bg-violet-600 shadow-sm shadow-violet-100 hover:shadow-md transition duration-500 ease-in-out px-5 py-3 text-sm font-medium text-white cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
