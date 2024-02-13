import React from 'react'
import ReactDOM from 'react-dom/client'
import { PostHogProvider } from 'posthog-js/react'

import { App } from './app.jsx'

import './styles/core/index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
    <PostHogProvider
        apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
        options={{ api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST }}
    >
        <App />
    </PostHogProvider>
)