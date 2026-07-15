import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import OpenExperience from './app/OpenExperience'
import './styles/index.css'

// Shared experience links (togathersg.com/experiences/:id) render the
// open-in-app fallback instead of the landing page. No router needed.
const experienceMatch = window.location.pathname.match(/^\/experiences\/([0-9a-f-]{36})\/?$/i)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {experienceMatch ? <OpenExperience id={experienceMatch[1]} /> : <App />}
  </StrictMode>,
)
