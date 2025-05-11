import axios from "axios";

const checkLogin = async () => {
  try {
    const response = await axios.get("http://localhost:4000/requireAuth", {
      withCredentials: true, // Ensures cookies are sent
    });

    if (response.data.user) {
      console.log("User is authenticated:", response.data.user);
      return response.data.user; // Return user details if authenticated
    } else {
      console.log("User not authenticated");
      return null;
    }
  } catch (error) {
    console.error("Authentication check failed:", error.response?.data || error.message);
    return null;
  }
};

export default checkLogin;
