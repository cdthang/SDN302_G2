import { useState } from "react";
import axios from "axios";

function CreatePost() {

  const [title,setTitle] = useState("");
  const [price,setPrice] = useState("");

  const submit = async () => {

    await axios.post("http://localhost:8000/posts",{
      title,
      price
    });

    alert("Post created");

  };

  return (
    <div>

      <h2>Create Post</h2>

      <input
        placeholder="Title"
        onChange={e=>setTitle(e.target.value)}
      />

      <input
        placeholder="Price"
        onChange={e=>setPrice(e.target.value)}
      />

      <button onClick={submit}>Post</button>

    </div>
  );
}

export default CreatePost;