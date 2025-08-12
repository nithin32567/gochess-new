import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Signin from "./pages/superadmin/signin";
import Dashboard from "./pages/superadmin/dashboard";
import ProtectedRoute from "./auth/superadmin";
import Layout from "./layouts/superadmin.layout";
import config from "./utils/config";

import './App.css';
import Tenants from "./pages/superadmin/tenants";

function App() {
 config();
 return (
  <Router>
   <ToastContainer />
   <Routes>
    {/* Public Route */}
    <Route path="/" element={<h1>Hello World</h1>} />
    {/* Superadmin Auth */}
    <Route path="/superadmin/auth" element={<Signin />} />
    <Route path="/superadmin" element={
     <ProtectedRoute>
      <Layout />
     </ProtectedRoute>}>
     <Route path="dashboard" element={<Dashboard />} />
     <Route path="tenants" element={<Tenants />} />
     <Route path="courses" element={<h1>Courses</h1>} />
     <Route path="settings" element={<h1>Settings</h1>} />
    </Route>
   </Routes>
  </Router>
 )
}

export default App
