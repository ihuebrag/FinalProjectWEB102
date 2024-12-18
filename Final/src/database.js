
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fbdfgyrwiejtbpucsgnj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiZGZneXJ3aWVqdGJwdWNzZ25qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5NjUxNzIsImV4cCI6MjA0NzU0MTE3Mn0.2oC06YHtV7Ao-8v-QzGBhfaQh4x5oa3yZyStS-mCtKA'
export const supabase = createClient(supabaseUrl, supabaseKey)

/* BAKCEND FUNCTIONS */

// Sign Up
export const signUp = async (email, password) => {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return user;
  };
  
// Login
export const login = async (email, password) => {
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return user;
  };
  
  