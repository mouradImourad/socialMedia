import React from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from './Router';
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />  {/* Use AppRouter instead of App */}
  </React.StrictMode>
);
