import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../database';
import Header from './header/header';
import { useNavigate } from 'react-router-dom';
import './postDetail.css';

const PostDetail = () => {
  const { postId } = useParams(); // Get postId from the URL
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(''); // State for new comment
  const [upvotes, setUpvotes] = useState(null);
  const navigate = useNavigate();

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


  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Fetch post details from Supabase or another source
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('*')
          .eq('id', postId)
          .single();
  
        if (postError) {
          console.error('Error fetching post:', postError.message);
          return;
        }
  
        setPost(postData); // Update the post state
        setUpvotes(postData.upvotes); // Set the initial upvotes count
  
        // Fetch comments for this post
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', postId);
  
        if (commentsError) {
          console.error('Error fetching comments:', commentsError.message);
          return;
        }
  
        setComments(commentsData); // Update the comments state
      } catch (error) {
        console.error('Unexpected error:', error.message);
      }
    };
  
    fetchPost(); // Call the function to fetch data
  }, []); // Only run when `postId` changes
  
  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Don't allow empty comments
  
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session?.user) {
        console.error('Error fetching session or user is not logged in:', sessionError?.message);
        return;
      }
  
      const user = sessionData.session.user; // Get the current user
  
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            text: newComment,
            user: user.email, // Use user's email or ID
            post_id: postId,
          },
        ]);
  
      if (error) {
        console.error('Error adding comment:', error.message);
        return;
      }
  
      // Add new comment to the state
      if (data) {
        setComments((prevComments) => [...prevComments, ...(Array.isArray(data) ? data : [data])]);
      }
      setNewComment(''); // Clear input
    } catch (error) {
      console.error('Unexpected error:', error.message);
    }
  };

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
  

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
    <Header />
    <div className="post-detail-container">
        <div style={styles.buttonContainer}>
          <button onClick={handleUpdate} style={styles.updateButton}>Update</button>
          <button onClick={handleDelete} style={styles.deleteButton}>Delete</button>
        </div>
      <h1 className="post-title">{post.caption}</h1>
      <img className="post-image" src={post.image} alt={post.caption} />
      <div className="post-details">
        <button onClick={handleUpvote} style={styles.upvoteButton}>
            👍 Upvote ({post.upvotes})
        </button>
        <p>Posted by: {post.user}</p>
      </div>
      <h2>Comments</h2>
      <div className="comments-section">
        {comments.length === 0 ? (
          <p>No comments yet!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <p className="user-cred">{comment.user}</p>
              <p>{comment.text}</p>
            </div>
          ))
        )}
      </div>

      <div className="add-comment">
        <h3>Add a Comment</h3>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment..."
          rows="3"
        />
        <button onClick={handleAddComment}>Submit Comment</button>
      </div>
    </div>
    </div>
  );
};

const styles = {
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

export default PostDetail;
