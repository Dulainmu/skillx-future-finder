import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { CareerProvider } from './contexts/CareerContext'

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <CareerProvider>
      <App />
    </CareerProvider>
  </AuthProvider>
);
