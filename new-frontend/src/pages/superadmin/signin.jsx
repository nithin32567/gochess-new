import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Chess from "../../svg/chess";

export default function Signin() {
 const [signinData, setSigninData] = useState({
  email: "",
  password: "",
 });
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(false);
 const navigate = useNavigate();
 const location = useLocation();

 // Get the return URL from location state or default to dashboard
 const from = location.state?.from?.pathname || "/superadmin/dashboard";

 useEffect(() => {
  // Check if already authenticated
  checkAuth();
 }, []);

 const checkAuth = async () => {
  try {
   const response = await axios.get(`/auth/superadmin/me`, {
    withCredentials: true,
   });
   console.log(response);
   // If already authenticated, redirect to the intended destination
   navigate(from, { replace: true });
  } catch (error) {
   // Not authenticated, stay on login page
  }
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
   const response = await axios.post(
    `/auth/superadmin/login`,
    signinData,
    { withCredentials: true }
   );
   console.log(response);
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
             sign in <i className="fa-solid fa-arrow-right" />
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
}
