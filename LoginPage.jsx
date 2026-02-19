import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'

export default function LoginPage() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login }             = useAuth()
  const navigate              = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authAPI.login(form)
      const data = res.data
      login({ id: data.id, email: data.email, firstName: data.firstName, lastName: data.lastName, role: data.role, profilePicture: data.profilePicture }, data.token)
      if (data.role === 'STUDENT')   navigate('/student/dashboard')
      if (data.role === 'PROFESSOR') navigate('/professor/dashboard')
      if (data.role === 'ADMIN')     navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1030 50%, #0d1a0d 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position:'absolute', width:400, height:400, background:'rgba(232,73,15,0.1)', borderRadius:'50%', filter:'blur(80px)', top:-100, right:-80, pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:300, height:300, background:'rgba(37,99,255,0.08)', borderRadius:'50%', filter:'blur(80px)', bottom:50, left:-60, pointerEvents:'none' }} />

      <div className="animate-fade-up" style={{ position:'relative', zIndex:1, width:'100%', maxWidth:400, padding:'0 24px' }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:36 }}>
          <div style={{ width:42, height:42, background:'#e8490f', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:20, color:'white' }}>U</div>
          <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:22, color:'white' }}>UcaLearn</span>
        </div>

        <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:30, fontWeight:700, color:'white', marginBottom:6, lineHeight:1.2 }}>Welcome back 👋</h1>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, marginBottom:28 }}>Sign in to continue your learning journey</p>

        {error && (
          <div style={{ background:'rgba(232,73,15,0.15)', border:'1px solid rgba(232,73,15,0.3)', color:'#ff6b3d', padding:'10px 14px', borderRadius:10, fontSize:13, marginBottom:20 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.45)', letterSpacing:1, display:'block', marginBottom:8 }}>EMAIL ADDRESS</label>
          <input
            type="email" required value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            placeholder="you@ucalearn.ma"
            style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'12px 16px', color:'white', fontSize:14, marginBottom:18, outline:'none' }}
            onFocus={e => e.target.style.borderColor = '#e8490f'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />

          <label style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.45)', letterSpacing:1, display:'block', marginBottom:8 }}>PASSWORD</label>
          <input
            type="password" required value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            placeholder="••••••••"
            style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'12px 16px', color:'white', fontSize:14, marginBottom:10, outline:'none' }}
            onFocus={e => e.target.style.borderColor = '#e8490f'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />

          <div style={{ textAlign:'right', marginBottom:24 }}>
            <span style={{ fontSize:12, color:'#e8490f', cursor:'pointer' }}>Forgot password?</span>
          </div>

          <button type="submit" disabled={loading} className="btn-flame" style={{ width:'100%', justifyContent:'center', padding:'13px', fontSize:15, opacity: loading ? 0.8 : 1 }}>
            {loading ? <><span className="spinner"></span> Signing in...</> : 'Sign In →'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:24, fontSize:13, color:'rgba(255,255,255,0.35)' }}>
          Don't have an account? <Link to="/register" style={{ color:'#e8490f', fontWeight:500 }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}
