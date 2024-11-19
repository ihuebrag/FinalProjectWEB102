import React, { useState } from "react";
import CreatePost from "./createPost";
import Posts from "./posts";
import Header from "../header/header";

const Feed = () => {
  const [isCreatePostVisible, setIsCreatePostVisible] = useState(false);

  const handleCreate = () => {
    // Toggle visibility of the CreatePost form
    setIsCreatePostVisible(!isCreatePostVisible);
  };

  return (
    <div>
      <Header />
      <h1>Feed</h1>
      {/* Show CreatePost form when isCreatePostVisible is true */}
      {isCreatePostVisible && <CreatePost />}
      
      <button onClick={handleCreate}>
        {isCreatePostVisible ? "Close Create Post" : "Create post"}
      </button>
      <p>Feed content...</p>
      <Posts />

    </div>
  );
};

export default Feed;
