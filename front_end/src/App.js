import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Posts from "./pages/Posts";
import CreatePost from "./pages/CreatePost";
import StudentUsedGoodsHomepage from "./pages/HomePage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

import Charities from "./pages/Charities";
import CreateCharity from "./pages/CreateCharity";
import CharityDetail from "./pages/CharityDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentUsedGoodsHomepage />} />

        <Route path="/posts" element={<Posts />} />
        <Route path="/create-post" element={<CreatePost />} />
        
        <Route path="/charities" element={<Charities />} />
        <Route path="/create-charity" element={<CreateCharity />} />
        <Route path="/charity/:id" element={<CharityDetail />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
