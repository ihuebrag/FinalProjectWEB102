import React from 'react';
import {useEffect} from 'react';
import { supabase } from './database';
import AuthForm from './components/authentication/authForm';

const App = () => {
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      console.log('User session:', session);
    });

    // Cleanup listener on component unmount
    return () => {
      //subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      <h1>Supabase Auth</h1>
      <AuthForm />
    </div>
  );
};

export default App;
