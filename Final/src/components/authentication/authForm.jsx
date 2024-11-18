import React, { useState } from 'react';
import { signUp, login } from '../../database';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const user = await signUp(email, password);
      console.log('User signed up:', user);
    } catch (error) {
      console.error('Sign-up error:', error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const user = await login(email, password);
      console.log('User logged in:', user);
      navigate('/dashboard');
    } catch (error) {
      alert('Wrong email/password...', error.message);
      console.error('Login error:', error.message);
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>Sign Up</button>
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
};

export default AuthForm;
