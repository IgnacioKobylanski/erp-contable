import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/accountTypes.css'
import './styles/buttons.css'
import App from './App.tsx'
import './styles/responsiveTable.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
