import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import { courseAPI, enrollAPI } from '../services/api'

const categories = ['All', 'Backend', 'Frontend', 'Database', 'Full Stack', 'Design', 'Mobile']

function CourseCard({ course, onEnroll, isEnrolled }) {
  const covers = { Backend:'#e8490f', Frontend:'#2563ff', Database:'#00b894', 'Full Stack':'#f0a500', Design:'#8b5cf6', Mobile:'#ec4899' }
  const bg = covers[course.category] || '#e8490f'

  return (
    <div className="card-hover" style={{ background:'white', borderRadius:16, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
      <div style={{ height:110, background:`linear-gradient(135deg, ${bg}, ${bg}99)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:44, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, opacity:0.12, backgroundImage:'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize:'16px 16px' }}></div>
        <span style={{ position:'relative' }}>{course.thumbnail || '📚'}</span>
      </div>
      <div style={{ padding:16 }}>
        <div style={{ fontSize:10, fontWeight:600, letterSpacing:1, textTransform:'uppercase', color:bg, marginBottom:6 }}>{course.category}</div>
        <h3 style={{ fontFamily:'Syne,sans-serif', fontSize:14, fontWeight:700, color:'#1a1a2e', marginBottom:8, lineHeight:1.3 }}>{course.title}</h3>
        <p style={{ fontSize:12, color:'#6b6880', marginBottom:12, lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{course.description}</p>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:11, color:'#6b6880', marginBottom:14 }}>
          <span>⏱ {course.durationHours}h • {course.level}</span>
          <span style={{ color:'#f0a500', fontWeight:500 }}>⭐ {course.rating?.toFixed(1)}</span>
        </div>
        <button
          onClick={() => !isEnrolled && onEnroll(course.id)}
          style={{
            width:'100%', padding:'9px', borderRadius:8, border:'none',
            background: isEnrolled ? 'rgba(0,184,148,0.1)' : '#1a1a2e',
            color: isEnrolled ? '#00b894' : 'white',
            fontSize:12, fontWeight:600, fontFamily:'Syne,sans-serif',
            cursor: isEnrolled ? 'default' : 'pointer', transition:'all 0.2s'
          }}
        >
          {isEnrolled ? '✓ Enrolled' : 'Enroll Now'}
        </button>
      </div>
    </div>
  )
}

export default function CoursesPage() {
  const { user }           = useAuth()
  const [courses, setCourses]     = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [category, setCategory]   = useState('All')
  const [enrolling, setEnrolling] = useState(null)
  const [toast, setToast]         = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, eRes] = await Promise.all([
          courseAPI.getAll(),
          user?.id ? enrollAPI.getByStudent(user.id) : Promise.resolve({ data: [] })
        ])
        setCourses(cRes.data)
        setEnrollments(eRes.data.map(e => e.course?.id))
      } catch(e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [user?.id])

  const handleSearch = async (val) => {
    setSearch(val)
    if (val.trim().length > 1) {
      const res = await courseAPI.search(val)
      setCourses(res.data)
    } else if (val === '') {
      const res = await courseAPI.getAll()
      setCourses(res.data)
    }
  }

  const handleEnroll = async (courseId) => {
    if (!user?.id) return
    setEnrolling(courseId)
    try {
      await enrollAPI.enroll(user.id, courseId)
      setEnrollments(prev => [...prev, courseId])
      setToast('Enrolled successfully! 🎉')
      setTimeout(() => setToast(''), 3000)
    } catch (e) {
      setToast(e.response?.data?.error || 'Already enrolled')
      setTimeout(() => setToast(''), 3000)
    } finally { setEnrolling(null) }
  }

  const filtered = courses.filter(c => category === 'All' || c.category === category)

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f5f3ee' }}>
      <Sidebar />
      <main style={{ flex:1, padding:'28px 32px', overflow:'auto' }}>
        {/* Toast */}
        {toast && (
          <div style={{ position:'fixed', top:24, right:24, background:'#1a1a2e', color:'white', padding:'12px 20px', borderRadius:12, fontSize:13, fontWeight:500, zIndex:1000, boxShadow:'0 8px 24px rgba(0,0,0,0.2)' }}>
            {toast}
          </div>
        )}

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <div>
            <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:700, color:'#1a1a2e' }}>Explore Courses</h1>
            <p style={{ fontSize:13, color:'#6b6880', marginTop:2 }}>{courses.length} courses available</p>
          </div>
          {/* Search */}
          <div style={{ display:'flex', alignItems:'center', gap:10, background:'white', border:'1px solid rgba(0,0,0,0.08)', borderRadius:10, padding:'9px 16px', boxShadow:'0 2px 8px rgba(0,0,0,0.04)', minWidth:240 }}>
            <span style={{ color:'#6b6880' }}>🔍</span>
            <input value={search} onChange={e => handleSearch(e.target.value)} placeholder="Search courses..."
              style={{ border:'none', outline:'none', fontSize:13, color:'#1a1a2e', background:'transparent', width:'100%' }} />
          </div>
        </div>

        {/* Category filters */}
        <div style={{ display:'flex', gap:8, marginBottom:24, flexWrap:'wrap' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              style={{ padding:'7px 16px', borderRadius:100, fontSize:12, fontWeight:500, cursor:'pointer', border: category === cat ? 'none' : '1.5px solid rgba(0,0,0,0.1)', background: category === cat ? '#1a1a2e' : 'white', color: category === cat ? 'white' : '#6b6880', transition:'all 0.15s' }}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', paddingTop:80 }}>
            <div className="spinner" style={{ width:32, height:32, borderWidth:3, borderColor:'rgba(0,0,0,0.1)', borderTopColor:'#e8490f' }}></div>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:20 }}>
            {filtered.map((course, i) => (
              <div key={course.id} className={`animate-fade-up delay-${Math.min(i+1,3)}`}>
                <CourseCard course={course} onEnroll={handleEnroll} isEnrolled={enrollments.includes(course.id)} />
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign:'center', paddingTop:80, color:'#6b6880' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
            <p style={{ fontSize:15 }}>No courses found</p>
          </div>
        )}
      </main>
    </div>
  )
}
