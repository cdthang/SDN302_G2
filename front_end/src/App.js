import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Posts from "./pages/Posts";
import CreatePost from "./pages/CreatePost";
import StudentUsedGoodsHomepage from "./pages/HomePage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentUsedGoodsHomepage />} />

        <Route path="/posts" element={<Posts />} />

        <Route path="/create-post" element={<CreatePost />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
