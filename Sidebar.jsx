import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const studentLinks   = [
  { to:'/student/dashboard', icon:'🏠', label:'Dashboard' },
  { to:'/courses',           icon:'📚', label:'Courses'   },
  { to:'/chat',              icon:'🤖', label:'AI Assistant'},
]
const professorLinks = [
  { to:'/professor/dashboard', icon:'🏠', label:'Dashboard' },
  { to:'/courses',             icon:'📚', label:'Courses'   },
  { to:'/chat',                icon:'🤖', label:'AI Assistant'},
]
const adminLinks = [
  { to:'/admin/dashboard', icon:'🏠', label:'Dashboard' },
  { to:'/courses',         icon:'📚', label:'Courses'   },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()
  const [showLogout, setShowLogout] = useState(false)

  const links = user?.role==='STUDENT' ? studentLinks
              : user?.role==='PROFESSOR' ? professorLinks
              : adminLinks

  return (
    <aside style={{ width:220, background:'#1a1a2e', minHeight:'100vh', display:'flex', flexDirection:'column', padding:'24px 16px', flexShrink:0 }}>
      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'0 8px', marginBottom:32 }}>
        <div style={{ width:34, height:34, background:'#e8490f', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:17, color:'white' }}>U</div>
        <span style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:17, color:'white' }}>UcaLearn</span>
      </div>

      {/* Nav */}
      <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
        <div style={{ fontSize:10, fontWeight:600, letterSpacing:2, color:'rgba(255,255,255,0.2)', textTransform:'uppercase', padding:'0 8px', marginBottom:8 }}>Main</div>
        {links.map(link => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span style={{ fontSize:16 }}>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop:'auto', paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
        <div
          onClick={() => setShowLogout(true)}
          style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:8, cursor:'pointer', color:'rgba(255,255,255,0.5)', fontSize:13, transition:'all 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color='#ff6b3d'}
          onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.5)'}
        >
          <span style={{ fontSize:16 }}>🚪</span>
          <span>Logout</span>
        </div>

        {/* Profile click */}
        <div
          onClick={() => navigate('/profile')}
          style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 8px 0', borderTop:'1px solid rgba(255,255,255,0.07)', marginTop:8, cursor:'pointer' }}
          title="View Profile"
        >
          <div style={{ width:32, height:32, borderRadius:'50%', background:'#e8490f', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'white', flexShrink:0 }}>{user?.firstName?.[0]}</div>
          <div style={{ flex:1, overflow:'hidden' }}>
            <div style={{ fontSize:12, fontWeight:600, color:'white', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.firstName} {user?.lastName}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)' }}>{user?.role}</div>
          </div>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.2)' }}>›</span>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogout && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#1a1a2e', border:'1px solid rgba(255,255,255,0.1)', borderRadius:20, padding:40, textAlign:'center', maxWidth:320, width:'90%' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>👋</div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:700, color:'white', marginBottom:8 }}>Ready to leave?</div>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:14, marginBottom:28 }}>Your progress is saved.</div>
            <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
              <button onClick={() => setShowLogout(false)} style={{ padding:'11px 24px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'rgba(255,255,255,0.6)', fontSize:14, cursor:'pointer' }}>Stay</button>
              <button onClick={() => { logout(); navigate('/login') }} style={{ padding:'11px 24px', background:'#e8490f', border:'none', borderRadius:10, color:'white', fontSize:14, fontWeight:600, fontFamily:'Syne,sans-serif', cursor:'pointer' }}>Yes, Logout</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
