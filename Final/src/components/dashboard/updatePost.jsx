import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../database';
import { useNavigate } from 'react-router-dom';

const UpdatePost = () => {
  const { postId } = useParams(); // Get postId from URL
  const [post, setPost] = useState({ caption: '', image: '' });
const navigate = useNavigate();
  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) {
        console.error('Error fetching post:', error.message);
        return;
      }

      setPost(data); // Set the post data for editing
    };

    fetchPost();
  }, [postId]);

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('posts')
      .update({ caption: post.caption, image: post.image })
      .eq('id', postId);

    if (error) {
      console.error('Error updating post:', error.message);
    } else {
      console.log('Post updated');
        navigate('/dashboard'); // Redirect to the dashboard after
    }
  };

  return (
    <div>
      <h1>Update Post</h1>
      <label>
        Caption:
        <input
          type="text"
          value={post.caption}
          onChange={(e) => setPost({ ...post, caption: e.target.value })}
        />
      </label>
      <br />
      <label>
        Image URL:
        <input
          type="text"
          value={post.image}
          onChange={(e) => setPost({ ...post, image: e.target.value })}
        />
      </label>
      <br />
      <button onClick={handleUpdate}>Update Post</button>
    </div>
  );
};

export default UpdatePost;
