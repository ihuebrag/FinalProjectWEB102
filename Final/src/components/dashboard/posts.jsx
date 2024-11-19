import React, { useEffect, useState } from 'react';
import { supabase } from '../../database';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Post = ({ post }) => {
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const navigate = useNavigate();

  const handleUpvote = async () => {
    setUpvotes((prev) => prev + 1);

    // Update the upvote count in the Supabase database
    const { error } = await supabase
      .from('posts')
      .update({ upvotes: upvotes + 1 })
      .eq('id', post.id);

    if (error) {
      console.error('Error updating upvotes:', error.message);
      setUpvotes((prev) => prev - 1); // Revert on failure
    }
  };

  function formatDate(dateString) {
    // Parse the ISO 8601 date string
    const date = new Date(dateString);
    
    // Get the month, day, and year
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    // Return formatted date as MM/DD/YYYY
    return `${month}/${day}/${year}`;
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    // Delete the post from the database
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', post.id);

    if (error) {
      console.error('Error deleting post:', error.message);
    } else {
      console.log('Post deleted');
      // Optionally redirect to another page after deletion
      navigate('/dashboard'); // Redirect to home or feed after delete
    }
  };

  const handleUpdate = () => {
    // Redirect to an update page with post ID in URL
    navigate(`/update-post/${post.id}`);
  };

  return (
    <div style={styles.postContainer}>
        <div style={styles.buttonContainer}>
          <button onClick={handleUpdate} style={styles.updateButton}>Update</button>
          <button onClick={handleDelete} style={styles.deleteButton}>Delete</button>
        </div>
      <img src={post.image} alt="Post" style={styles.image} />
      <div style={styles.content}>
        <h3 style={styles.caption}>{post.caption}</h3>
        <h4>{formatDate(post.created_at)}</h4>
        <p style={styles.user}>Posted by: {post.user}</p>
        <div style={styles.upvoteContainer}>
          <button onClick={handleUpvote} style={styles.upvoteButton}>
            👍 Upvote ({upvotes})
          </button>
        </div>
        <Link to={`/post/${post.id}`}>See details</Link>
      </div>
    </div>
  );
};

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error.message);
      } else {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <p>Loading posts...</p>;
  }

  return (
    <div style={styles.postsContainer}>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

const styles = {
  postsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    margin: '20px',
  },
  postContainer: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    width: '300px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  content: {
    padding: '10px',
  },
  caption: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '10px 0',
  },
  user: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '10px',
  },
  upvoteContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  upvoteButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
  upvotes: {
    fontSize: '14px',
    fontWeight: 'bold',
  },
};

export default Posts;
