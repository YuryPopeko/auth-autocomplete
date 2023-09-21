import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './pages/login';
import Search from './pages/search';
import RequireAuth from './components/require-auth';

import './styles/app.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/search"
        element={
          <RequireAuth>
            <Search />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;
