import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../database';
import { useState } from 'react';

const Header = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          if (sessionError || !sessionData?.session?.user) {
            console.error('Error fetching session or user is not logged in:', sessionError?.message);
            return;
          }
          setUser(sessionData.session.user); // Get the current user
        };
        fetchData();
    }, []); // Only run once on component mount

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut(); // Log the user out
      console.log('User logged out');
      // Redirect to login page or home after logout
      window.location.href = '/'; // or use React Router's useHistory() to redirect
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const handleLogin = () => {
    // Redirect to the login page
    window.location.href = '/'; // or use React Router's useHistory() to redirect
  };



  return (
    <header style={headerStyle}>
      <nav style={navStyle}>
        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
        <div style={authButtonContainerStyle}>
          {user ? (
            <button onClick={handleLogout} style={buttonStyle}>Logout</button>
          ) : (
            <button onClick={handleLogin} style={buttonStyle}>Login</button>
          )}
        </div>
      </nav>
    </header>
  );
};

// Styles for the header
const headerStyle = {
  backgroundColor: '#333',
  color: '#fff',
  padding: '10px 20px',
  position: 'sticky',
  top: '0',
  zIndex: '1000',
};

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontSize: '18px',
};

const authButtonContainerStyle = {
  display: 'flex',
  gap: '10px',
};

const buttonStyle = {
  backgroundColor: '#555',
  color: '#fff',
  border: 'none',
  padding: '8px 16px',
  cursor: 'pointer',
  borderRadius: '4px',
};

export default Header;
