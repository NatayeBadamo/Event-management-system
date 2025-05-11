import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const Signin = () => {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); 


  const handleSignin = async (event) => {
    event.preventDefault(); // Prevent page reload

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:4000/signin", // Update with your actual login endpoint
        { ...form }, // ✅ Corrected: Spread form values
        { withCredentials: true } // Allows cookies to be stored for authentication
      );

      console.log("Signin successful:", response.data);
      window.location.href = "/Login"; // ✅ Redirect and refresh
    } catch (error) {
      console.error("Signin failed:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Signin failed");
    }finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-green-600 font font-extrabold">En cours d'inscription ...</p>;

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 shadow-md shadow-black mt-16">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Sign in today!</h1>
        <p className="mt-4 text-gray-500 underline font font-extrabold">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Et libero nulla eaque error neque
          ipsa culpa autem, at itaque nostrum!
        </p>
      </div>

      <form onSubmit={handleSignin} className="mx-auto mt-8 mb-0 max-w-md space-y-4 bg-gray-900 rounded text-white p-5 shadow-md shadow-black">
        <div>
          <label htmlFor="nom" className="sr-only">Nom</label>
          <div className="relative">
            <input
              type="text"
              className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs text-white outline-none"
              placeholder="Enter nom"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })} // ✅ Fixed onChange
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <div className="relative">
            <input
              type="email"
              className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs text-white outline-none"
              placeholder="Enter email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} // ✅ Fixed onChange
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="sr-only">Password</label>
          <div className="relative">
            <input
              type="password"
              className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-xs text-white outline-none"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} // ✅ Fixed onChange
              required
            />
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>} {/* ✅ Display error if exists */}

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Vous avez déjà un compte ?
            <Link className="underline" to="/Login"> Login</Link>
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
}

export default Signin;
