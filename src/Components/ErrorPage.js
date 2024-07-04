// ErrorPage.js

import React from 'react';
import { useTheme } from '../ThemeContext';

const ErrorPage = () => {
  const { darkMode } = useTheme();

  return (
    <div
      style={{
        backgroundColor: darkMode ? '#191919' : '#fff',
        color: darkMode ? '#fff' : '#000',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <h1 style={{ fontSize: '4rem' }}>404</h1>
      <p style={{ fontSize: '1.5rem' }}>Page Not Found</p>
      <a href="/" style={{ marginTop: '20px', fontSize: '1rem', color: darkMode ? '#ff0000' : '#000' }}>
        Go to Home
      </a>
    </div>
  );
};

export default ErrorPage;
