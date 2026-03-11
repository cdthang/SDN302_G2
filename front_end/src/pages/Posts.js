import { useEffect, useState } from "react";
import axios from "axios";

function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/posts")
      .then(res => setPosts(res.data));
  }, []);

  return (
    <div>
      <h2>Marketplace</h2>
      {posts.map(p => (
        <div key={p._id}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
          <p>{p.price} VND</p>
        </div>
      ))}
    </div>
  );
}

export default Posts;