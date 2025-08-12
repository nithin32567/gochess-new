import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Chess from "../../svg/chess";

const Signin = () => {
 const [signinData, setSigninData] = useState({
  email: "",
  password: "",
 });
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(false);
 const navigate = useNavigate();
 const location = useLocation();
 const api_url = import.meta.env.VITE_API_URL;

 // Get the return URL from location state or default to dashboard
 const from = location.state?.from?.pathname || "/superadmin/dashboard";

 useEffect(() => {
  // Check if already authenticated
  checkAuth();
 }, []);

 const checkAuth = async () => {
  try {
   await axios.get(`${api_url}/auth/superadmin/me`, {
    withCredentials: true,
   });
   // If already authenticated, redirect to the intended destination
   navigate(from, { replace: true });
  } catch (error) {
   console.log(error);
   // Not authenticated, stay on login page
  }
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
   const response = await axios.post(
    `${api_url}/auth/superadmin/login`,
    signinData,
    { withCredentials: true }
   );
   console.log(response);
   localStorage.setItem("token", response.data.token);
   // Redirect to the intended destination
   navigate(from, { replace: true });
  } catch (error) {
   setError(
    error.response?.data?.message || "An error occurred during login"
   );
  } finally {
   setLoading(false);
  }
 };

 const handleChange = (e) => {
  setSigninData({ ...signinData, [e.target.name]: e.target.value });
 };

 useEffect(() => {
  document.body.classList.add("login-page");
  return () => document.body.classList.remove("login-page");
 }, []);

 return (
  <>
   <div className="container-fluid">
    <div className="row">
     <div className="col-lg-6">
      <div className="login-left-con">
       <div className="login-left-middlealign">
        <div className="row justify-content-center">
         <div className="col-xl-6 col-lg-9 col-md-8">
          <div className="login-container-wrap">
           <div className="login-logo">
            <img src="/img/gochess-logo.png" alt="Go Chess" />
           </div>
           <div className="welcometext">
            <h4>Welcome Back!</h4>
            <p>Log in to access your account &amp; explore more.</p>
           </div>
           {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
             {error}
            </div>
           )}
           <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="inputitem">
             <i className="fa-solid fa-user" />
             <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              placeholder="Username / Email"
             />
            </div>
            <div className="inputitem">
             <i className="fa-solid fa-lock" />
             <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              placeholder="Password"
             />
            </div>
            <button
             disabled={loading}
             className="login-btn">
             {loading ? "Signing in..." : "Sign in"} <i className="fa-solid fa-arrow-right" />
            </button>
           </form>
           <a href="#" className="forgot-pass">
            Forgot Password?
           </a>
           {/* <hr /> */}
           {/* <button onClick={() => popupCenter("/signin", "Sample Sign In", closeHandler)} className="google-btn">
           <img src="img/google.png" alt="Google" />
           Continue with Google
          </button> */}
          </div>
         </div>
        </div>
       </div>
      </div>
     </div>
     <div className="col-lg-6">
      <div className="login-right-con">
       <div>
        <span>
         <Chess />
        </span>
        <h4>
         Master the Game - Learn, <br />
         Play, &amp; Conquer with <b>GoChess</b> Academy!
        </h4>
       </div>
      </div>
     </div>
    </div>
   </div>
  </>
 );
};

export default Signin;
