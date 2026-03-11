import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Posts from './pages/Posts';
import CreatePost from './pages/CreatePost';
import StudentUsedGoodsHomepage from "./pages/HomePage";

function App() {
  return (
    <Router>

      <Routes>

        <Route path="/" element={<StudentUsedGoodsHomepage />} />

        <Route path="/posts" element={<Posts />} />

        <Route path="/create-post" element={<CreatePost />} />

      </Routes>

    </Router>
  );
}

export default App;