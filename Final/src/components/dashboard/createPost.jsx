import React, { useState } from 'react';
import { supabase } from '../../database';
import { useEffect } from 'react';

const CreatePost = () => {
  const [image, setImage] = useState('');
  const [caption, setCaption] = useState('');
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session?.user) {
        console.error('Error fetching session or user is not logged in:', sessionError?.message);
        return;
      }
      setUser(sessionData.session.user.email); // Get the current user
    };
    fetchData();
}, []); // Only run once on component mount

  const handleCreatePost = async () => {
    if (!image || !caption || !user) {
      setMessage('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setMessage('');

    const { data, error } = await supabase.from('posts').insert([
      {
        image,
        caption,
        user,
        upvotes: 0, // Initialize upvotes to 0
      },
    ]);

    if (error) {
      console.error('Error creating post:', error.message);
      setMessage('Failed to create post. Please try again.');
    } else {
      setMessage('Post created successfully!');
      setImage('');
      setCaption('');
      setUser('');
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2>Create a New Post</h2>
      <input
        type="text"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleCreatePost} style={styles.button} disabled={loading}>
        {loading ? 'Creating...' : 'Create Post'}
      </button>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '10px',
    fontSize: '14px',
    color: '#333',
  },
};

export default CreatePost;
