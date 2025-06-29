import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AlertProvider } from './context/AlertProvider'
import AlertBanner from './components/AlertBanner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AlertProvider>
      <AlertBanner />
      <App />
    </AlertProvider>
  </StrictMode>,
)
