import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';  // Your home page component
import Feed from './components/dashboard/feed';
import PostDetail from './components/postDetail';

function Routing() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />  {/* Define your Home component */}
        <Route path="/App" element={<App />} />  {/* Define your Home component */}
        <Route path="/dashboard" element={<Feed />} />  {/* Define your Dashboard component */}
        <Route path="/post/:postId" element={<PostDetail />} />
      </Routes>
    </Router>
  );
}

export default Routing;
