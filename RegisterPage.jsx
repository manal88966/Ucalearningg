import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'

export default function RegisterPage() {
  const [form, setForm]       = useState({ firstName:'', lastName:'', email:'', password:'', role:'STUDENT' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login }             = useAuth()
  const navigate              = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res  = await authAPI.register(form)
      const data = res.data
      login({ id:data.id, email:data.email, firstName:data.firstName, lastName:data.lastName, role:data.role }, data.token)
      navigate(data.role === 'STUDENT' ? '/student/dashboard' : '/professor/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const field = (label, key, type='text', placeholder='') => (
    <div style={{ marginBottom:18 }}>
      <label style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.45)', letterSpacing:1, display:'block', marginBottom:8 }}>{label}</label>
      <input type={type} required placeholder={placeholder} value={form[key]}
        onChange={e => setForm({...form, [key]: e.target.value})}
        style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'12px 16px', color:'white', fontSize:14, outline:'none' }}
        onFocus={e => e.target.style.borderColor='#e8490f'}
        onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'}
      />
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0a0a0f,#1a1030,#0d1a0d)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px' }}>
      <div style={{ position:'absolute', width:400, height:400, background:'rgba(37,99,255,0.08)', borderRadius:'50%', filter:'blur(80px)', top:-80, left:-80 }} />

      <div className="animate-fade-up" style={{ position:'relative', zIndex:1, width:'100%', maxWidth:440 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:32 }}>
          <div style={{ width:40, height:40, background:'#e8490f', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:18, color:'white' }}>U</div>
          <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:20, color:'white' }}>UcaLearn</span>
        </div>

        <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:28, fontWeight:700, color:'white', marginBottom:6 }}>Create account ✨</h1>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, marginBottom:28 }}>Join thousands of learners today</p>

        {error && <div style={{ background:'rgba(232,73,15,0.15)', border:'1px solid rgba(232,73,15,0.3)', color:'#ff6b3d', padding:'10px 14px', borderRadius:10, fontSize:13, marginBottom:20 }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:0 }}>
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.45)', letterSpacing:1, display:'block', marginBottom:8 }}>FIRST NAME</label>
              <input required value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} placeholder="Sara"
                style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'12px 16px', color:'white', fontSize:14, outline:'none', marginBottom:18 }}
                onFocus={e=>e.target.style.borderColor='#e8490f'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
            </div>
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.45)', letterSpacing:1, display:'block', marginBottom:8 }}>LAST NAME</label>
              <input required value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} placeholder="Ahmed"
                style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'12px 16px', color:'white', fontSize:14, outline:'none', marginBottom:18 }}
                onFocus={e=>e.target.style.borderColor='#e8490f'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
            </div>
          </div>

          {field('EMAIL ADDRESS', 'email', 'email', 'you@ucalearn.ma')}
          {field('PASSWORD', 'password', 'password', '••••••••')}

          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.45)', letterSpacing:1, display:'block', marginBottom:8 }}>I AM A</label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[['STUDENT','👩‍🎓'],['PROFESSOR','👨‍🏫']].map(([r, icon]) => (
                <div key={r} onClick={() => setForm({...form, role:r})}
                  style={{ background: form.role===r ? 'rgba(232,73,15,0.15)' : 'rgba(255,255,255,0.05)',
                    border: `1.5px solid ${form.role===r ? '#e8490f' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius:10, padding:'12px', textAlign:'center', cursor:'pointer', color: form.role===r ? '#ff6b3d' : 'rgba(255,255,255,0.5)', fontSize:14, transition:'all 0.15s' }}>
                  <div style={{ fontSize:24, marginBottom:4 }}>{icon}</div>
                  <div style={{ fontSize:12, fontWeight:600 }}>{r}</div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-flame" style={{ width:'100%', justifyContent:'center', padding:13, fontSize:15 }}>
            {loading ? <><span className="spinner"></span> Creating account...</> : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:20, fontSize:13, color:'rgba(255,255,255,0.35)' }}>
          Already have an account? <Link to="/login" style={{ color:'#e8490f', fontWeight:500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
