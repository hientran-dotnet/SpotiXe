import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a1a',
            color: '#FFFFFF',
            border: '1px solid #282828',
          },
          success: {
            iconTheme: {
              primary: '#1DB954',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#FA243C',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
);
