import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {API_BASE_URL} from '../config/api'

export default function AdminLogin({ onLoginSuccess, token }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [token, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Access request rejected.')
      }

      onLoginSuccess(data.token) 
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <div className="min-h-screen w-full flex items-center justify-center bg-bg2">
      <form 
        onSubmit={handleLogin} 
        className="w-full max-w-sm rounded-3xl !p-8 bg-card border border-border animate-fade-up"
      >
        <div className="font-bebas text-4xl text-center !mb-1 tracking-wide text-dsa">
          CONSOLE GATE
        </div>
        <p className="font-mono-jetbrains text-[0.55rem] text-center uppercase tracking-[2px] !mb-6 text-muted">
          System Passphrase Validation
        </p>
        
        {error && (
          <div className="text-xs text-red-400 border border-red-900/30 rounded-xl !p-3 !mb-4 bg-red-950/10 font-mono-jetbrains text-center">
            {error}
          </div>
        )}
        
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[0.6rem] font-mono-jetbrains uppercase tracking-[1.5px] !mb-1.5 text-muted2">
              Master Passphrase
            </label>
            <input 
              type="password" 
              required 
              disabled={loading}
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••••••"
              className="w-full rounded-xl !py-2.5 !px-4 text-center text-sm outline-none tracking-widest transition-all duration-200 bg-[#121829] border border-border2 text-dsa focus:border-dsa disabled:opacity-50" 
              onFocus={e => (e.target.style.borderColor = '#00e5ff')}
              onBlur={e => (e.target.style.borderColor = '#1e2e48')}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="font-mono-jetbrains text-xs uppercase tracking-[2px] w-full !py-3 rounded-xl !mt-2 font-semibold transition-all duration-200 disabled:opacity-50 bg-dsa text-bg2 cursor-none"
          >
            {loading ? 'Verifying...' : 'Unlock Console →'}
          </button>
        </div>
      </form>
    </div>
    </>
  )
}
