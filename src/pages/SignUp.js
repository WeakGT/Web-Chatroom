// SignUp.js
import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, database } from '../firebase';
import { ref, set } from 'firebase/database';
import './SignUp.css';

function SignUp({ switchToLogin }) {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        const usersListRef = ref(database, `users/${user.uid}/`);
        set(usersListRef, {
          uid: user.uid,
          email: user.email
        });
        switchToLogin();
      }
    });

    return () => unsub();
  }, [switchToLogin]);

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, {
        displayName: displayName
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      switchToLogin();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className={`signup-container ${fade ? 'fade-out' : 'fade-in'}`}>
      <h2>Sign Up</h2>
      <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="signup-input" placeholder="  Nickname" />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="signup-input" placeholder="  Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="signup-input" placeholder="  Password" />
      <button onClick={handleSignUp} className="signup-button">Sign Up</button>
      <button onClick={handleGoogleLogin} className="google-login-button">Continue with Google</button>
      <p className="login-link">Already have an account? <span onClick={() => { setFade(true); switchToLogin(); }}>Login</span></p>
    </div>
  );
}

export default SignUp;
