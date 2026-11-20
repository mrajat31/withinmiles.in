import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import BunnyChat from './components/BunnyChat'
import Home from './pages/Home'
import Trips from './pages/Trips'
import TripDetail from './pages/TripDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import ReviewPage from './pages/ReviewPage'
import Community from './pages/Community'
import Admin from './pages/admin/Admin'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/:slug" element={<TripDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/community" element={<Community />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppFloat />
      <BunnyChat />
    </div>
  )
}
