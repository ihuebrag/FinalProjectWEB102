import React, { useEffect, useState } from 'react';
import { supabase } from '../../database';
import { Link } from 'react-router-dom';

const Post = ({ post }) => {
  const [upvotes, setUpvotes] = useState(post.upvotes);

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

  return (
    <div style={styles.postContainer}>
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
  const [sortBy, setSortBy] = useState('created_at'); // State for sorting criteria
  const [searchQuery, setSearchQuery] = useState(''); // State for search query


  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order(sortBy, { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error.message);
      } else {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [sortBy]);

  const filteredPosts = posts.filter((post) =>
    post.caption.toLowerCase().includes(searchQuery.toLowerCase()) // Case-insensitive search
  );

  if (loading) {
    return <p>Loading posts...</p>;
  }

  return (
    <div>
        {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Search by caption..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
          style={styles.searchInput}
        />
      </div>
        {/* Sorting Buttons */}
      <div>
        <button onClick={() => setSortBy('created_at')}>Sort by Date</button>
        <button onClick={() => setSortBy('upvotes')}>Sort by Upvotes</button>
      </div>
        <div style={styles.postsContainer}>
        {filteredPosts.map((post) => (
            <Post key={post.id} post={post} />
        ))}
        </div>
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
  button: {
    padding: '8px 16px',
    margin: '5px',
    cursor: 'pointer',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
};

export default Posts;
