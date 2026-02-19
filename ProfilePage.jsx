import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'
import api from '../services/api'

export default function ProfilePage() {
  const { user, login, token } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    email:     user?.email     || '',
    bio:       user?.bio       || '',
  })
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })
  const [tab, setTab]     = useState('info')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ msg:'', type:'' })

  const showToast = (msg, type='success') => {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg:'', type:'' }), 3000)
  }

  const handleSaveInfo = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.put(`/users/${user.id}`, form)
      // Update context with new user info
      login({ ...user, firstName: form.firstName, lastName: form.lastName, email: form.email, bio: form.bio }, token)
      showToast('Profile updated successfully! ✅')
    } catch (err) {
      showToast(err.response?.data?.error || 'Error updating profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (passwords.newPass !== passwords.confirm) {
      showToast('Passwords do not match', 'error')
      return
    }
    if (passwords.newPass.length < 6) {
      showToast('Password must be at least 6 characters', 'error')
      return
    }
    setSaving(true)
    try {
      await api.put(`/users/${user.id}/password`, {
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
      })
      setPasswords({ current:'', newPass:'', confirm:'' })
      showToast('Password changed successfully! 🔒')
    } catch (err) {
      showToast(err.response?.data?.error || 'Current password is incorrect', 'error')
    } finally {
      setSaving(false)
    }
  }

  const roleColor = { STUDENT:'#2563ff', PROFESSOR:'#f0a500', ADMIN:'#e8490f' }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f5f3ee' }}>
      <Sidebar />
      <main style={{ flex:1, padding:'28px 32px', overflow:'auto' }}>

        {/* Toast */}
        {toast.msg && (
          <div style={{ position:'fixed', top:24, right:24, background: toast.type==='error' ? '#ef4444' : '#1a1a2e', color:'white', padding:'12px 20px', borderRadius:12, fontSize:13, fontWeight:500, zIndex:1000, boxShadow:'0 8px 24px rgba(0,0,0,0.2)' }}>
            {toast.msg}
          </div>
        )}

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
          <button onClick={() => navigate(-1)} style={{ background:'white', border:'1px solid rgba(0,0,0,0.08)', borderRadius:9, width:36, height:36, cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>←</button>
          <div>
            <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:700, color:'#1a1a2e' }}>My Profile</h1>
            <p style={{ fontSize:13, color:'#6b6880', marginTop:2 }}>Manage your personal information</p>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:20, alignItems:'start' }}>

          {/* Left - avatar card */}
          <div style={{ background:'white', borderRadius:16, padding:28, boxShadow:'0 2px 12px rgba(0,0,0,0.04)', textAlign:'center' }}>
            <div style={{ width:80, height:80, background:'#e8490f', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, fontWeight:700, color:'white', margin:'0 auto 16px', fontFamily:'Syne,sans-serif' }}>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:17, fontWeight:700, color:'#1a1a2e', marginBottom:4 }}>
              {user?.firstName} {user?.lastName}
            </div>
            <span style={{ display:'inline-block', fontSize:11, padding:'4px 12px', borderRadius:100, background:`${roleColor[user?.role]}15`, color:roleColor[user?.role], fontWeight:600, marginBottom:16 }}>
              {user?.role}
            </span>
            <div style={{ fontSize:12, color:'#6b6880', marginBottom:8 }}>{user?.email}</div>
            {user?.bio && <div style={{ fontSize:12, color:'#6b6880', fontStyle:'italic', marginTop:8, lineHeight:1.5 }}>{user.bio}</div>}

            <div style={{ marginTop:20, paddingTop:20, borderTop:'1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize:11, color:'#6b6880', marginBottom:4 }}>Member since</div>
              <div style={{ fontSize:12, fontWeight:500, color:'#1a1a2e' }}>February 2026</div>
            </div>
          </div>

          {/* Right - edit form */}
          <div style={{ background:'white', borderRadius:16, padding:28, boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
            {/* Tabs */}
            <div style={{ display:'flex', gap:4, background:'#f5f3ee', borderRadius:10, padding:4, marginBottom:24, width:'fit-content' }}>
              {[['info','👤 Personal Info'], ['password','🔒 Change Password']].map(([t, label]) => (
                <button key={t} onClick={() => setTab(t)} style={{ padding:'8px 18px', borderRadius:8, border:'none', background: tab===t ? 'white' : 'transparent', color: tab===t ? '#1a1a2e' : '#6b6880', fontSize:13, fontWeight: tab===t ? 600 : 400, cursor:'pointer', fontFamily:'Syne,sans-serif', boxShadow: tab===t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition:'all 0.15s' }}>
                  {label}
                </button>
              ))}
            </div>

            {tab === 'info' ? (
              <form onSubmit={handleSaveInfo}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
                  {[['First Name','firstName','text','Sara'],['Last Name','lastName','text','Ahmed']].map(([label, key, type, ph]) => (
                    <div key={key}>
                      <label style={{ fontSize:11, fontWeight:600, color:'#6b6880', letterSpacing:1, display:'block', marginBottom:7, textTransform:'uppercase' }}>{label}</label>
                      <input type={type} value={form[key]} placeholder={ph}
                        onChange={e => setForm({...form, [key]: e.target.value})}
                        style={{ width:'100%', border:'1.5px solid rgba(0,0,0,0.1)', borderRadius:10, padding:'11px 14px', fontSize:14, outline:'none', transition:'border-color 0.2s' }}
                        onFocus={e => e.target.style.borderColor='#e8490f'}
                        onBlur={e => e.target.style.borderColor='rgba(0,0,0,0.1)'}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom:16 }}>
                  <label style={{ fontSize:11, fontWeight:600, color:'#6b6880', letterSpacing:1, display:'block', marginBottom:7, textTransform:'uppercase' }}>Email Address</label>
                  <input type="email" value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    style={{ width:'100%', border:'1.5px solid rgba(0,0,0,0.1)', borderRadius:10, padding:'11px 14px', fontSize:14, outline:'none' }}
                    onFocus={e => e.target.style.borderColor='#e8490f'}
                    onBlur={e => e.target.style.borderColor='rgba(0,0,0,0.1)'}
                  />
                </div>

                <div style={{ marginBottom:24 }}>
                  <label style={{ fontSize:11, fontWeight:600, color:'#6b6880', letterSpacing:1, display:'block', marginBottom:7, textTransform:'uppercase' }}>Bio</label>
                  <textarea value={form.bio} rows={3}
                    onChange={e => setForm({...form, bio: e.target.value})}
                    placeholder="Tell us a little about yourself..."
                    style={{ width:'100%', border:'1.5px solid rgba(0,0,0,0.1)', borderRadius:10, padding:'11px 14px', fontSize:14, outline:'none', resize:'vertical', fontFamily:'DM Sans,sans-serif' }}
                    onFocus={e => e.target.style.borderColor='#e8490f'}
                    onBlur={e => e.target.style.borderColor='rgba(0,0,0,0.1)'}
                  />
                </div>

                <button type="submit" disabled={saving} className="btn-flame" style={{ padding:'12px 28px' }}>
                  {saving ? <><span className="spinner"></span> Saving...</> : 'Save Changes'}
                </button>
              </form>

            ) : (
              <form onSubmit={handleChangePassword}>
                {[
                  ['Current Password', 'current',  'Your current password'],
                  ['New Password',     'newPass',  'Minimum 6 characters'],
                  ['Confirm New Password', 'confirm', 'Repeat new password'],
                ].map(([label, key, ph]) => (
                  <div key={key} style={{ marginBottom:16 }}>
                    <label style={{ fontSize:11, fontWeight:600, color:'#6b6880', letterSpacing:1, display:'block', marginBottom:7, textTransform:'uppercase' }}>{label}</label>
                    <input type="password" value={passwords[key]} placeholder={ph}
                      onChange={e => setPasswords({...passwords, [key]: e.target.value})}
                      style={{ width:'100%', border:'1.5px solid rgba(0,0,0,0.1)', borderRadius:10, padding:'11px 14px', fontSize:14, outline:'none' }}
                      onFocus={e => e.target.style.borderColor='#e8490f'}
                      onBlur={e => e.target.style.borderColor='rgba(0,0,0,0.1)'}
                    />
                  </div>
                ))}
                <div style={{ height:8 }} />
                <button type="submit" disabled={saving} className="btn-flame" style={{ padding:'12px 28px' }}>
                  {saving ? <><span className="spinner"></span> Saving...</> : 'Change Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
