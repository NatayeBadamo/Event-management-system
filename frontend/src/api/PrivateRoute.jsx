import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import checkLogin from "./Login";
const PrivateRoute = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const loggedInUser = await checkLogin();
      setUser(loggedInUser);
      setLoading(false);
    };

    fetchUser();
  }, []); 

  if (loading) return <p>Loading...</p>; 

  return user ? <Outlet /> : <Navigate to="/Login" />;
};

export default PrivateRoute;
  