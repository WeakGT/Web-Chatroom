import React, { useState, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import './App.css';

function App() {
  const { user } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const switchToSignUp = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);
  let content;
  
  if (user) {
    content = <Home />;
  }
  else {
    if (isLogin) content = <Login switchToSignUp={switchToSignUp} />;
    else content = <SignUp switchToLogin={switchToLogin} />;
  }

  return (
    <div className="App">
      <div className="form-container">
        {content}
      </div>
    </div>
  );
}

export default App;
