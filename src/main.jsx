import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import site from './config/site.js'
import './styles/tokens.css'
import './styles/app.css'

// Business facts live only in src/config/site.js — stamp the document
// title/description from there instead of hardcoding them in index.html.
document.title = `${site.name} — ${site.address.split(',').slice(1, 2).join('').trim()} Barbershop`
document
  .querySelector('meta[name="description"]')
  ?.setAttribute(
    'content',
    `${site.name} — barbershop at ${site.address}. Book your chair.`,
  )

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
