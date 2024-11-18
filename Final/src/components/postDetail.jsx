import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../database';

const PostDetail = () => {
  const { postId } = useParams(); // Get postId from the URL
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(''); // State for new comment


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
  

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{post.caption}</h1>
      <img src={post.image} alt={post.caption} width={300} />
      <p>Upvotes: {post.upvotes}</p>
      <p>Posted by: {post.user}</p>

      <h2>Comments</h2>
      {comments.length === 0 ? (
        <p>No comments yet!</p>
      ) : (
        comments.map(comment => (
          <div key={comment.id}>
            <p>{comment.text}</p>
            <p>Posted by: {comment.user}</p>
          </div>
        ))
      )}

      {/* Add Comment Section */}
      <div>
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
  );
};

export default PostDetail;
