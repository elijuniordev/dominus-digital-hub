import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'; // 1. Importe

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. Envolva o App com o Provider */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)