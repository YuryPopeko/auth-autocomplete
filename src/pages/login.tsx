import React from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../helpers/api';

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (email && password) {
      api.post('login', { email, password }).then((response) => {
        localStorage.setItem('accessToken', response.data.access_token);
        localStorage.setItem('refreshToken', response.data.refresh_token);
        navigate('/search');
      }, alert);
    } else {
      alert('Please, provide an email and password.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input
        name="email"
        type="text"
        placeholder="Email"
        className="input"
        autoFocus
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        className="input"
      />
      <button type="submit" className="input">
        Login
      </button>
    </form>
  );
};

export default Login;
