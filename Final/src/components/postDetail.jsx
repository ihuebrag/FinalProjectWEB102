import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPost } from '../database';

const PostDetail = () => {
  const { postId } = useParams(); // Get postId from the URL
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Fetch the post data using the postId
    const fetchPost = async () => {
      // Fetch post details (you would fetch from Supabase or another API)
      const postResponse = await fetchPost(postId);
      const postData = await postResponse.json();
      setPost(postData);

      // Fetch comments for this post (again, replace with your fetch logic)
      const commentsResponse = await fetch(`/api/comments?postId=${postId}`);
      const commentsData = await commentsResponse.json();
      setComments(commentsData);
    };

    fetchPost();
  }, [postId]); // Re-run when postId changes

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
    </div>
  );
};

export default PostDetail;
