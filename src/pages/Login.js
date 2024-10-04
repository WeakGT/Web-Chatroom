// Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import './Login.css';

function Login({ switchToSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fade, setFade] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className={`login-container ${fade ? 'fade-out' : 'fade-in'}`}>
      <h2>Login</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="login-input" placeholder="  Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="login-input" placeholder="  Password" />
      <button onClick={handleLogin} className="login-button">Login</button>
      <p className="signup-link">Do not have an account? <span onClick={() => { setFade(true); switchToSignUp(); }}>Sign up</span></p>
    </div>
  );
}

export default Login;
