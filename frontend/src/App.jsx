import { useState , useEffect} from 'react';
import axios from "axios";
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from './pages/Home';
import Account from './pages/Account';
import Details from './pages/Details';
import Login from './pages/Login';
import Signin from './pages/Signin';
import PrivateRoute from './api/PrivateRoute';
import checkLogin from './api/Login';
import RedirectIfAuthenticated from './api/ProtectRoute';
import myImage from "./assets/upcoming-events-neon-text-sign-vector-22241374.jpg";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const loggedInUser = await checkLogin();
      setUser(loggedInUser);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
        const response = await axios.get("http://localhost:4000/logout", {
            withCredentials: true, // Ensures cookies are sent
        });

        console.log(response.data.message); // Log the response
        window.location.href = "/Login"; // ✅ Refresh and navigate to Login page
    } catch (error) {
        console.error("Logout failed:", error.response?.data || error.message);
    }
};


  return (
      <>
        <Router>
          <header className="bg-white">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="md:flex md:items-center md:gap-12">
                  <Link to="/" className="block text-teal-600">
                    <span className="sr-only">Home</span>
                    <img src={myImage} alt="My Image" className="w-32 h-16 object-cover rounded-2xl shadow-black shadow-xl mt-4" />
                  </Link>
                </div>

                { user ? (
                  <div className="hidden md:block">
                  <nav aria-label="Global">
                    <h1 className="text-green-500 font font-bold mb-5 shadow-md shadow-violet-700 rounded bg-gray-800">Bienvenue, {user.nom}!</h1>
                    <ul className="flex items-center gap-6 text-sm">
                      <li>
                        <Link className="text-gray-500 transition hover:text-gray-500/75 underline font font-extrabold" to="/account"> Account </Link>
                      </li>

                      <li>
                        <Link className="text-gray-500 transition hover:text-gray-500/75 underline font font-extrabold" onClick={handleLogout}> Logout </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
                ) : (
                  <div className="flex items-center gap-4">
                  <div className="sm:flex sm:gap-4">
                    <Link
                      className="rounded-md bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-black"
                      to="/Login"
                    >
                      Login
                    </Link>

                    <div className="hidden sm:flex">
                      <Link
                        className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-violet-900 shadow-md shadow-black"
                        to="/Signin"
                      >
                        Register
                      </Link>
                    </div>
                  </div>

                  <div className="block md:hidden">
                    <button
                      className="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                )}
                

                
              </div>
            </div>
          </header>

          <Routes>
            <Route path='/' element={<Home />} />

            {/* Prevent logged-in users from accessing Login & Signin */}
            <Route element={<RedirectIfAuthenticated />}>
              <Route path='/Login' element={<Login />} />
              <Route path='/Signin' element={<Signin />} />
            </Route>

            {/* Private routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/account" element={<Account />} />
              <Route path="/details/:id" element={<Details />} />
            </Route>
          </Routes>

          
        </Router>
      </>
  )
}

export default App
