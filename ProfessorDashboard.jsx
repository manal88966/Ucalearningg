import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import { courseAPI } from '../services/api'

export default function ProfessorDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast]       = useState('')
  const [form, setForm]         = useState({ title:'', description:'', category:'Backend', level:'Beginner', durationHours:'', thumbnail:'📚' })

  useEffect(() => { loadCourses() }, [user.id])

  const loadCourses = async () => {
    try {
      const res = await courseAPI.getByProf(user.id)
      setCourses(res.data || [])
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await courseAPI.create({ ...form, durationHours: parseInt(form.durationHours) }, user.id)
      setToast('Course created! 🎉')
      setShowForm(false)
      setForm({ title:'', description:'', category:'Backend', level:'Beginner', durationHours:'', thumbnail:'📚' })
      loadCourses()
      setTimeout(() => setToast(''), 3000)
    } catch(e) { setToast('Error creating course') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this course?')) return
    await courseAPI.delete(id)
    setCourses(c => c.filter(x => x.id !== id))
    setToast('Course deleted')
    setTimeout(() => setToast(''), 2000)
  }

  const handlePublish = async (id) => {
    await courseAPI.publish(id)
    setCourses(c => c.map(x => x.id === id ? {...x, published: true} : x))
    setToast('Course published! ✅')
    setTimeout(() => setToast(''), 2000)
  }

  const published = courses.filter(c => c.published).length
  const drafts    = courses.filter(c => !c.published).length

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f5f3ee' }}>
      <Sidebar />
      <main style={{ flex:1, padding:'28px 32px', overflow:'auto' }}>
        {toast && <div style={{ position:'fixed', top:24, right:24, background:'#1a1a2e', color:'white', padding:'12px 20px', borderRadius:12, fontSize:13, fontWeight:500, zIndex:1000, boxShadow:'0 8px 24px rgba(0,0,0,0.2)' }}>{toast}</div>}

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
          <div>
            <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:700, color:'#1a1a2e' }}>Hello, Prof. <span style={{ color:'#e8490f' }}>{user?.lastName}</span> 👋</h1>
            <p style={{ fontSize:13, color:'#6b6880', marginTop:2 }}>Manage your courses and track student progress</p>
          </div>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <button onClick={() => setShowForm(true)} className="btn-flame">+ New Course</button>
            <div onClick={() => navigate('/profile')} style={{ width:38, height:38, background:'#e8490f', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'white', cursor:'pointer' }}>
              {user?.firstName?.[0]}
            </div>
          </div>
        </div>

        {/* Stats — live count */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:24 }}>
          {[
            { icon:'📚', val: courses.length, label:'My Courses',  color:'#e8490f' },
            { icon:'📢', val: published,       label:'Published',   color:'#00b894' },
            { icon:'📝', val: drafts,           label:'Drafts',      color:'#f0a500' },
          ].map((s,i) => (
            <div key={i} className="card-hover" style={{ background:'white', borderRadius:14, padding:18, boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
              <div style={{ width:36, height:36, background:`${s.color}18`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, marginBottom:12 }}>{s.icon}</div>
              <div style={{ fontFamily:'Syne,sans-serif', fontSize:26, fontWeight:700, color:'#1a1a2e' }}>{s.val}</div>
              <div style={{ fontSize:11, color:'#6b6880' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Course list */}
        <div style={{ background:'white', borderRadius:16, padding:24, boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:16, fontWeight:700, marginBottom:20 }}>My Courses</h2>
          {loading ? <div style={{ textAlign:'center', padding:40, color:'#6b6880' }}>Loading...</div>
          : courses.length === 0 ? (
            <div style={{ textAlign:'center', padding:40, color:'#6b6880' }}>
              <div style={{ fontSize:40, marginBottom:12 }}>📚</div>
              <p>No courses yet. Create your first one!</p>
            </div>
          ) : courses.map(c => (
            <div key={c.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 0', borderBottom:'1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ width:44, height:44, background:'rgba(232,73,15,0.08)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{c.thumbnail}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14, color:'#1a1a2e' }}>{c.title}</div>
                <div style={{ fontSize:12, color:'#6b6880', marginTop:2 }}>{c.category} • {c.level} • {c.durationHours}h</div>
              </div>
              <span style={{ fontSize:11, padding:'4px 10px', borderRadius:100, fontWeight:500, background: c.published ? 'rgba(0,184,148,0.1)' : 'rgba(240,165,0,0.1)', color: c.published ? '#00b894' : '#f0a500' }}>
                {c.published ? 'Published' : 'Draft'}
              </span>
              <div style={{ display:'flex', gap:8 }}>
                {!c.published && <button onClick={() => handlePublish(c.id)} style={{ padding:'6px 12px', background:'#e8490f', color:'white', border:'none', borderRadius:7, fontSize:11, fontWeight:600, cursor:'pointer' }}>Publish</button>}
                <button onClick={() => handleDelete(c.id)} style={{ padding:'6px 12px', background:'rgba(239,68,68,0.1)', color:'#ef4444', border:'none', borderRadius:7, fontSize:11, fontWeight:600, cursor:'pointer' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Modal */}
        {showForm && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
            <div style={{ background:'white', borderRadius:20, padding:32, width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
                <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:700 }}>Create New Course</h2>
                <button onClick={() => setShowForm(false)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#6b6880' }}>✕</button>
              </div>
              <form onSubmit={handleCreate}>
                {[['Course Title','title','text','Spring Boot Mastery...'],['Description','description','text','What students will learn...'],['Duration (hours)','durationHours','number','40']].map(([label,key,type,ph]) => (
                  <div key={key} style={{ marginBottom:16 }}>
                    <label style={{ fontSize:12, fontWeight:500, color:'#6b6880', display:'block', marginBottom:6 }}>{label}</label>
                    <input type={type} required value={form[key]} placeholder={ph} onChange={e => setForm({...form,[key]:e.target.value})}
                      style={{ width:'100%', border:'1.5px solid rgba(0,0,0,0.1)', borderRadius:10, padding:'11px 14px', fontSize:14, outline:'none' }}
                      onFocus={e=>e.target.style.borderColor='#e8490f'} onBlur={e=>e.target.style.borderColor='rgba(0,0,0,0.1)'}/>
                  </div>
                ))}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
                  <div>
                    <label style={{ fontSize:12, fontWeight:500, color:'#6b6880', display:'block', marginBottom:6 }}>Category</label>
                    <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} style={{ width:'100%', border:'1.5px solid rgba(0,0,0,0.1)', borderRadius:10, padding:'11px 14px', fontSize:14, outline:'none' }}>
                      {['Backend','Frontend','Database','Full Stack','Design','Mobile'].map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:12, fontWeight:500, color:'#6b6880', display:'block', marginBottom:6 }}>Level</label>
                    <select value={form.level} onChange={e=>setForm({...form,level:e.target.value})} style={{ width:'100%', border:'1.5px solid rgba(0,0,0,0.1)', borderRadius:10, padding:'11px 14px', fontSize:14, outline:'none' }}>
                      {['Beginner','Intermediate','Advanced'].map(l=><option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom:24 }}>
                  <label style={{ fontSize:12, fontWeight:500, color:'#6b6880', display:'block', marginBottom:8 }}>Thumbnail</label>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {['📚','☕','⚛️','🗄️','🚀','🎨','📱','🔒','🤖'].map(e=>(
                      <button type="button" key={e} onClick={() => setForm({...form,thumbnail:e})}
                        style={{ width:40, height:40, borderRadius:8, border: form.thumbnail===e ? '2px solid #e8490f' : '1.5px solid rgba(0,0,0,0.1)', background: form.thumbnail===e ? 'rgba(232,73,15,0.05)' : 'white', fontSize:20, cursor:'pointer' }}>{e}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-outline" style={{ flex:1 }}>Cancel</button>
                  <button type="submit" className="btn-flame" style={{ flex:1, justifyContent:'center' }}>Create Course</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
