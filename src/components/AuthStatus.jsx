import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "axios";


const AuthStatus = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`http://localhost:4000/users/${auth.user.id}`, {
        headers: {
          Authorization: `Bearer ${auth.user.accessToken}`
        }
      });
      setUserData(response.data);
    };
    if (auth.user) {
      fetchData();
    }
  }, [auth.user]);

    

  
  const handleLogout = () => {
    auth.logOutUser(() => navigate("/"));
  };

  return (
    <>
      {auth.user ? (
        <>
          {userData ? (
            <p>Welcome back {userData.username || userData.email}</p>
          ) : (
            <p>Loading user data...</p>
          )}
          <button onClick={handleLogout}>Log Out</button>
        </>
      ) : (
        <>
          <p>You can log in here</p>
          {window.location.pathname === "/login" ? null : <button onClick={() => navigate("/login")}>Log in</button>}
        </>
      )}
    </>
  );
};

export default AuthStatus;
