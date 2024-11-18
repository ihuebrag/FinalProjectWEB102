import React, { useState } from "react";
import CreatePost from "./createPost";
import Posts from "./posts";

const Feed = () => {
  const [isCreatePostVisible, setIsCreatePostVisible] = useState(false);

  const handleCreate = () => {
    // Toggle visibility of the CreatePost form
    setIsCreatePostVisible(!isCreatePostVisible);
  };

  return (
    <div>
      <h1>Feed</h1>
      <p>Feed content...</p>
      <Posts />
      
      {/* Show CreatePost form when isCreatePostVisible is true */}
      {isCreatePostVisible && <CreatePost />}
      
      <button onClick={handleCreate}>
        {isCreatePostVisible ? "Close Create Post" : "Create post"}
      </button>
    </div>
  );
};

export default Feed;
