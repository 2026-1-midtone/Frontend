import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.scss'

const shouldUseCanonicalDevHost =
  import.meta.env.DEV && window.location.hostname === '127.0.0.1'

if (shouldUseCanonicalDevHost) {
  const canonicalUrl = new URL(window.location.href)
  canonicalUrl.hostname = 'localhost'
  window.location.replace(canonicalUrl)
} else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
