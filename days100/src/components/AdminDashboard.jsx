import { useState, useEffect } from 'react'
import AdminLogin from '../pages/AdminLogin'
import {API_BASE_URL} from '../config/api'

const TECH_TRACKS = ['DSA', 'DevOps', 'AWS']
const LEVEL_MAP = { 1: 'Easy', 2: 'Medium', 3: 'Hard' }

export default function AdminDashboard({ token, onLogout }) {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ day: '', title: '', tech: 'DSA', diff: 1, code: '', pro_statement: '' })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (token) {
      localStorage.setItem('adminToken', token)
      fetchAdminData()
    } else {
      localStorage.removeItem('adminToken')
    }
  }, [token])

  const fetchAdminData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/admin/challenges`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.status === 401 || res.status === 403) {
        setToken('')
        return
      }
      const data = await res.json()
      setChallenges(data)
    } catch (err) {
      console.error('Data retrieval failed', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setAuthError('')
    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Authentication error')
      setToken(data.token)
    } catch (err) {
      setAuthError(err.message)
    }
  }

  const handleLogout = () => {
    onLogout()
  }

  const openModal = (challenge = null) => {
    setFormError('')
    if (challenge) {
      setEditingId(challenge._id)
      setForm({
        day: challenge.day,
        title: challenge.title,
        tech: challenge.tech,
        diff: challenge.diff,
        code: challenge.code || '',
        pro_statement: challenge.pro_statement || '',
        tags: Array.isArray(challenge.tags) ? challenge.tags.join(', ') : ''
      })
    } else {
      setEditingId(null)
      const nextDay = challenges.length > 0 ? Math.max(...challenges.map(c => c.day)) + 1 : 1
      setForm({ day: nextDay, title: '', tech: 'DSA', diff: 1, code: '', pro_statement: '' })
    }
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setFormError('')
    
    const finalTags = typeof form.tags === 'string'
    ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
    : Array.isArray(form.tags) ? form.tags : [];

  const payload = {
    ...form,
    tags: finalTags
  };

    const url = editingId ? `${API_BASE_URL}/admin/challenges/${editingId}` : `${API_BASE_URL}/admin/challenges`
    const method = editingId ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Operation failed')

      setModalOpen(false)
      fetchAdminData()
    } catch (err) {
      setFormError(err.message)
    }
  }

  const handleDelete = async (id, day) => {
    if (!confirm(`Are you absolutely sure you want to delete Day ${day}?`)) return
    try {
      const res = await fetch(`${API_BASE_URL}/admin/challenges/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) fetchAdminData()
    } catch (err) {
      console.error('Delete operation caught error', err)
    }
  }

  if (!token) {
    return (
      <AdminLogin />
    )
  }

  return (
    <>
    <div className="min-h-screen !p-10 bg-bg  animate-fade-up">
      
      <div className="flex justify-between items-center border-b border-border !pb-6 !mb-8 ">
        <div>
          <h1 className="font-bebas text-5xl tracking-wide text-dsa">Console Panel</h1>
          <p className="font-mono-jetbrains text-xs uppercase tracking-widest text-muted">Database Records Manager</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => openModal()} className="font-mono-jetbrains text-xs tracking-widest uppercase !px-4 !py-2.5 rounded-full border border-dsa text-dsa bg-dsa/3 transition-all duration-150 cursor-none hover:bg-dsa hover:text-black">+ Create Challenge</button>
          <button onClick={handleLogout} className="font-mono-jetbrains text-xs tracking-widest uppercase !px-5 !py-2.5 rounded-full transition-all border border-devops text-devops bg-devops/3 duration-150 cursor-none hover:bg-devops hover:text-black">Exit Console</button>
        </div>
      </div>

      {loading ? (
        <div className="text-center font-mono-jetbrains text-xs !py-20 text-muted">LOADING RECORDS FROM DATABASE...</div>
      ) : (
        <div className="w-full overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-left ">
            <thead className="font-mono-jetbrains text-[0.7rem] uppercase tracking-widest border-b border-border bg-bg2/80 text-muted">
              <tr>
                <th className="!py-4 !px-6 w-20">Day</th>
                <th className="!py-4 !px-6">Challenge Title</th>
                <th className="!py-4 !px-6 w-32">Track</th>
                <th className="!py-4 !px-6 w-32">Difficulty</th>
                <th className="!py-4 !px-6 w-40 text-center">Control Keys</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-outfit text-sm">
              {challenges.map((c) => (
                <tr key={c._id} className="hover:bg-border2/20 transition-colors duration-100">
                  <td className="!py-3.5 !px-6 font-mono-jetbrains text-dsa font-bold">#{String(c.day).padStart(2, '0')}</td>
                  <td className="!py-3.5 !px-6 font-semibold  max-w-xs truncate">{c.title}</td>
                  <td className="!py-3.5 !px-6">
                    <span className="font-mono-jetbrains text-[0.65rem] px-2.5 py-0.5 rounded-md" style={{ 
                      background: c.tech === 'DSA' ? 'rgba(0,229,255,0.08)' : c.tech === 'DevOps' ? 'rgba(255,61,107,0.08)' : 'rgba(255,184,0,0.08)',
                      color: c.tech === 'DSA' ? '#00e5ff' : c.tech === 'DevOps' ? '#ff3d6b' : '#ffb800'
                    }}>{c.tech}</span>
                  </td>
                  <td className="!py-3.5 !px-6 text-sm opacity-80 text-muted2">{LEVEL_MAP[c.diff]}</td>
                  <td className="!py-3.5 !px-6 text-center">
                    <div className="flex justify-center gap-3 font-mono-jetbrains text-[0.58rem] tracking-[1px]">
                      <button onClick={() => openModal(c)} className="text-dsa hover:underline uppercase cursor-none">Edit</button>
                      <span className="opacity-20 ">|</span>
                      <button onClick={() => handleDelete(c._id, c.day)} className="text-devops uppercase hover:underline cursor-none">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {challenges.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center font-mono-jetbrains text-xs !py-12 text-muted/90">No entries saved in database records.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm !mt-12 !p-4 animate-fade-up">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl !p-6 border border border-border bg-card modal-box">
            <div className="flex justify-between items-center !mb-5">
              <h3 className="font-bebas text-3xl tracking-wide text-dsa">{editingId ? `Modify Record #${form.day}` : 'Create New Track Day'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-sm text-muted hover: font-mono-jetbrains transition-colors cursor-none">✕ Close</button>
            </div>

            {formError && <div className="text-xs text-red-400 border border-red-900/30 rounded-xl !p-3 !mb-4 bg-red-950/10 font-mono-jetbrains text-center">{formError}</div>}

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[0.6rem] font-mono-jetbrains uppercase tracking-[1px] !mb-1 opacity-60">Day Tracker Number</label>
                  <input type="number" required value={form.day} onChange={e => setForm({ ...form, day: parseInt(e.target.value) || '' })} className="w-full rounded-xl !p-2.5 outline-none text-white bg-bg3 border border-border2  focus:border-dsa"/>
                </div>
                <div>
                  <label className="block text-[0.6rem] font-mono-jetbrains uppercase tracking-[1px] !mb-1 opacity-60 ">Tech Core Track</label>
                  <select value={form.tech} onChange={e => setForm({ ...form, tech: e.target.value })} className="w-full rounded-xl !p-2.5 outline-none bg-bg3 border border-border2  focus:border-dsa">
                    {TECH_TRACKS.map(t => <option key={t} value={t} className="bg-card">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[0.6rem] font-mono-jetbrains uppercase tracking-[1px] !mb-1 opacity-60">Difficulty Index</label>
                  <select value={form.diff} onChange={e => setForm({ ...form, diff: parseInt(e.target.value) })} className="w-full rounded-xl !p-2.5 outline-none bg-bg3 border border-border2 focus:border-dsa">
                    {Object.entries(LEVEL_MAP).map(([val, name]) => <option key={val} value={val} className="bg-card">{name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[0.6rem] font-mono-jetbrains uppercase tracking-[1px] !mb-1 opacity-60">Challenge Question Title</label>
                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Delete node of List" className="w-full rounded-xl !p-2.5 outline-none font-mono-jetbrains bg-bg3 border border-border2  text-xs focus:border-dsa"/>
              </div>

              <div>
                <label className="block text-[0.6rem] font-mono-jetbrains uppercase tracking-[1px] !mb-1 opacity-60">Problem Statement</label>
                <textarea rows="4" value={form.pro_statement} onChange={e => setForm({ ...form, pro_statement: e.target.value })} placeholder="Provide system overview details here..." className="w-full rounded-xl !p-2.5 outline-none font-mono-jetbrains bg-bg3 border border-border2  text-xs focus:border-dsa"></textarea>
              </div>

              <div>
                <label className="block text-[0.6rem] font-mono-jetbrains uppercase tracking-[1px] !mb-1 opacity-60">Code Implementation Solution</label>
                <textarea rows="6" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="// Paste clean solution functions here..." className="w-full rounded-xl !p-2.5 outline-none font-mono-jetbrains bg-bg3 border border-border2 text-xs focus:border-dsa"></textarea>
              </div>

              <div>
                <label className="block text-[0.6rem] font-mono-jetbrains uppercase tracking-[1px] !mb-1 opacity-60">
                Search Engine Tags (Comma Separated)
                </label>
                <input 
                type="text" 
                value={form.tags} 
                onChange={e => setForm({ ...form, tags: e.target.value })} 
                placeholder="arrays, binary-search, dynamics" 
                className="w-full rounded-xl !p-2.5 outline-none  font-mono-jetbrains bg-bg3 border border-border2  text-xs focus:border-dsa"
                />
              </div>

              <div className="flex justify-end gap-3 !mt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="font-mono-jetbrains text-[0.6rem] tracking-[1px] uppercase !px-5 !py-2.5 rounded-xl border border-border opacity-60 transition-colors cursor-none hover:opacity-100">Cancel</button>
                <button type="submit" className="font-mono-jetbrains text-[0.6rem] tracking-[1px] uppercase !px-6 !py-2.5 rounded-xl font-bold bg-dsa text-bg2 transition-all duration-200 cursor-none">Commit Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  )
}
