import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'

import Cursor from './components/Cursor.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import Tracks from './components/Tracks.jsx'
import Challenges from './components/Challenges.jsx'
import Progress from './components/Progress.jsx'
import Modal from './components/Modal.jsx'
import Featured from './components/Featured.jsx'
import Footer from './components/Footer.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import RouteGuard from './components/RouteGuard.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'

import MetaSEO from './components/MetaSEO.jsx'

function BaseLayout({ onOpenModal }) {
  return (
    <>
    <div className="bg-bg text-text min-h-screen overflow-hidden">
      <Cursor />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
    </>
  )
}

function HomeView({ setActiveChallenge }) {
  return (
    <>
    <main className="pt-16">
      <Hero />
      <Marquee />
      <Tracks />
      <Challenges onOpenModal={setActiveChallenge} />
      <Progress />
      <Featured />
    </main>
    </>
  )
}

export default function App() {
  const [activeChallenge, setActiveChallenge] = useState(null)

  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '')

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('adminToken', newToken)
    setAdminToken(newToken)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setAdminToken('')
  }

  return (
    <BrowserRouter>
      <MetaSEO challenge={activeChallenge} />
      <Routes>
        <Route element={<BaseLayout />}>
          
          <Route path="/" element={
            <HomeView setActiveChallenge={setActiveChallenge} />
          } />

          <Route path="/admin/loginMy" element={<AdminLogin onLoginSuccess={handleLoginSuccess} token={adminToken} />} />

          <Route 
            path="/admin/dashboard" 
            element={
              <RouteGuard token={adminToken}>
                <main className="!pt-8">
                  <AdminDashboard token={adminToken} onLogout={handleLogout}/>
                </main>
              </RouteGuard>
            } 
          />

        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Modal challenge={activeChallenge} onClose={() => setActiveChallenge(null)} />
    </BrowserRouter>
  )
}
