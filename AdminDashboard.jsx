import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { adminAPI, courseAPI } from '../services/api'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats]     = useState({})
  const [users, setUsers]     = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState('overview')
  const [toast, setToast]     = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [s, u, c] = await Promise.all([adminAPI.getStats(), adminAPI.getUsers(), courseAPI.getAll()])
        setStats(s.data); setUsers(u.data); setCourses(c.data)
      } catch(e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const handleToggle = async (id) => {
    const updated = await adminAPI.toggleUser(id)
    setUsers(u => u.map(x => x.id === id ? updated.data : x))
    setToast('User updated'); setTimeout(() => setToast(''), 2000)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return
    await adminAPI.deleteUser(id)
    setUsers(u => u.filter(x => x.id !== id))
    setToast('User deleted'); setTimeout(() => setToast(''), 2000)
  }

  const roleColor = { STUDENT:'#2563ff', PROFESSOR:'#f0a500', ADMIN:'#e8490f' }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#0d0d14' }}>
      <Sidebar />
      <main style={{ flex:1, padding:'28px 32px', overflow:'auto', color:'white' }}>
        {toast && <div style={{ position:'fixed', top:24, right:24, background:'#e8490f', color:'white', padding:'12px 20px', borderRadius:12, fontSize:13, fontWeight:500, zIndex:1000 }}>{toast}</div>}

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
          <div>
            <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:700 }}>Admin <span style={{ color:'#e8490f' }}>Control Panel</span></h1>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginTop:2 }}>Manage platform users, courses and statistics</p>
          </div>
          <div onClick={() => navigate('/profile')} style={{ width:38, height:38, background:'#e8490f', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'white', cursor:'pointer' }}>A</div>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:4, background:'rgba(255,255,255,0.04)', borderRadius:10, padding:4, width:'fit-content', marginBottom:28 }}>
          {['overview','users','courses'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding:'8px 20px', borderRadius:8, border:'none', background: tab===t ? 'white' : 'transparent', color: tab===t ? '#1a1a2e' : 'rgba(255,255,255,0.4)', fontSize:13, fontWeight: tab===t ? 600 : 400, fontFamily:'Syne,sans-serif', cursor:'pointer', textTransform:'capitalize', transition:'all 0.15s' }}>{t}</button>
          ))}
        </div>

        {loading ? <div style={{ textAlign:'center', paddingTop:80 }}><div className="spinner" style={{ width:32, height:32, borderWidth:3, borderColor:'rgba(255,255,255,0.1)', borderTopColor:'#e8490f' }}></div></div>
        : tab==='overview' ? (
          <>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
              {[
                { label:'Students',    val:stats.totalStudents,    color:'#e8490f' },
                { label:'Professors',  val:stats.totalProfessors,  color:'#5b8fff' },
                { label:'Courses',     val:stats.totalCourses,     color:'#00b894' },
                { label:'Enrollments', val:stats.totalEnrollments, color:'#f0a500' },
              ].map((s,i) => (
                <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:20 }}>
                  <div style={{ fontFamily:'Syne,sans-serif', fontSize:32, fontWeight:800, color:s.color }}>{s.val ?? '—'}</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginTop:4 }}>Total {s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:20 }}>
              <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:15, fontWeight:700, marginBottom:16 }}>Recent Users</h2>
              {users.slice(0,5).map(u => (
                <div key={u.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:`${roleColor[u.role]}28`, color:roleColor[u.role], display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700 }}>{u.firstName?.[0]}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:500 }}>{u.firstName} {u.lastName}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>{u.email}</div>
                  </div>
                  <span style={{ fontSize:10, padding:'3px 10px', borderRadius:100, fontWeight:500, background:`${roleColor[u.role]}20`, color:roleColor[u.role] }}>{u.role}</span>
                </div>
              ))}
            </div>
          </>
        ) : tab==='users' ? (
          <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:20 }}>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:15, fontWeight:700, marginBottom:16 }}>All Users ({users.length})</h2>
            {users.map(u => (
              <div key={u.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:`${roleColor[u.role]}28`, color:roleColor[u.role], display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700 }}>{u.firstName?.[0]}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500 }}>{u.firstName} {u.lastName}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>{u.email} · {u.role}</div>
                </div>
                <span style={{ fontSize:11, padding:'3px 10px', borderRadius:100, background: u.active ? 'rgba(0,184,148,0.15)' : 'rgba(239,68,68,0.15)', color: u.active ? '#00b894' : '#ef4444' }}>{u.active ? 'Active' : 'Inactive'}</span>
                <div style={{ display:'flex', gap:6 }}>
                  <button onClick={() => handleToggle(u.id)} style={{ padding:'5px 12px', borderRadius:7, border:'none', background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.6)', fontSize:11, cursor:'pointer' }}>{u.active ? 'Disable' : 'Enable'}</button>
                  <button onClick={() => handleDelete(u.id)} style={{ padding:'5px 12px', borderRadius:7, border:'none', background:'rgba(239,68,68,0.1)', color:'#ef4444', fontSize:11, cursor:'pointer' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:20 }}>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:15, fontWeight:700, marginBottom:16 }}>All Courses ({courses.length})</h2>
            {courses.map(c => (
              <div key={c.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize:24 }}>{c.thumbnail}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500 }}>{c.title}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>{c.category} · {c.level} · ⭐{c.rating?.toFixed(1)}</div>
                </div>
                <span style={{ fontSize:11, padding:'3px 10px', borderRadius:100, background: c.published ? 'rgba(0,184,148,0.15)' : 'rgba(240,165,0,0.15)', color: c.published ? '#00b894' : '#f0a500' }}>{c.published ? 'Published' : 'Draft'}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
