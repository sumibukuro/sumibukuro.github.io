import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import KarasuzoPage from './pages/KarasuzoPage/KarasuzoPage'
import ErrorPage from './pages/ErrorPage/ErrorPage'
import './index.scss'
import HomePage from './pages/HomePage/HomePage'

export const inCordova = location.origin === 'https://localhost' || location.origin === 'file://'

// for game
if ('serviceWorker' in navigator && !inCordova) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then((registration) => {
                console.log('SW registered: ', registration)
            })
            .catch((err) => {
                console.log('SW failed: ', err)
            })
    })
}
document.ontouchmove = function (e) {
    e.preventDefault()
}

// gh-pages redirect
if (location.search.startsWith('?ghp=')) {
    const route = decodeURIComponent(location.search.slice(5))
    history.replaceState(null, null, route)
}

const CurrentRouter = HashRouter // location.origin === 'file://' ? HashRouter : BrowserRouter
createRoot(document.querySelector('#root')).render(
    <CurrentRouter>
        <Routes>
            <Route path="/karasuzo" element={<KarasuzoPage />} />
            <Route path="/404.html" element={<ErrorPage title="404" />} />
            <Route path="/404" element={<ErrorPage title="404" />} />
            <Route path="/index.html" element={<HomePage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<ErrorPage title="404" />} />
        </Routes>
    </CurrentRouter>,
)
