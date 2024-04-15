import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { DlgProvider } from './context/DlgProvider';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <DlgProvider>
    <App />
  </DlgProvider>
);

