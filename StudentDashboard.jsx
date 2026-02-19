import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import { enrollAPI, quizAPI } from '../services/api'

function StatCard({ icon, value, label, color }) {
  return (
    <div className="card-hover animate-fade-up" style={{ background:'white', borderRadius:14, padding:20, boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <div style={{ width:40, height:40, background:`${color}18`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{icon}</div>
      </div>
      <div style={{ fontFamily:'Syne,sans-serif', fontSize:30, fontWeight:700, color:'#1a1a2e' }}>{value}</div>
      <div style={{ fontSize:12, color:'#6b6880', marginTop:4 }}>{label}</div>
    </div>
  )
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState([])
  const [stats, setStats]             = useState({ totalEnrolled:0, completed:0, inProgress:0, certificates:0 })
  const [results, setResults]         = useState([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    if (!user?.id) return
    const load = async () => {
      try {
        const [enrRes, statsRes, quizRes] = await Promise.all([
          enrollAPI.getByStudent(user.id),
          enrollAPI.getStats(user.id),
          quizAPI.getResults(user.id),
        ])
        setEnrollments(enrRes.data || [])
        setStats(statsRes.data || { totalEnrolled:0, completed:0, inProgress:0, certificates:0 })
        setResults(quizRes.data || [])
      } catch (e) {
        console.error('Dashboard load error:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?.id])

  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const today = new Date().getDay()

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f5f3ee' }}>
      <Sidebar />
      <main style={{ flex:1, padding:'28px 32px', overflow:'auto' }}>
        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
          <div>
            <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:22, fontWeight:700, color:'#1a1a2e' }}>
              Hello, <span style={{ color:'#e8490f' }}>{user?.firstName}</span> 👋
            </h1>
            <p style={{ fontSize:13, color:'#6b6880', marginTop:2 }}>Welcome back! Ready to keep learning?</p>
          </div>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <div style={{ width:38, height:38, background:'white', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', cursor:'pointer', position:'relative' }}>
              🔔
              <div style={{ position:'absolute', top:7, right:7, width:8, height:8, background:'#e8490f', borderRadius:'50%', border:'2px solid white' }} />
            </div>
            <div
              onClick={() => navigate('/profile')}
              style={{ width:38, height:38, background:'#e8490f', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'white', cursor:'pointer' }}
              title="My Profile"
            >
              {user?.firstName?.[0]}
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', paddingTop:80 }}>
            <div className="spinner" style={{ width:32, height:32, borderWidth:3, borderColor:'rgba(0,0,0,0.1)', borderTopColor:'#e8490f' }}></div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
              <StatCard icon="📚" value={stats.totalEnrolled ?? 0} label="Enrolled Courses"  color="#e8490f" />
              <StatCard icon="✅" value={stats.completed ?? 0}      label="Completed"         color="#00b894" />
              <StatCard icon="⏳" value={stats.inProgress ?? 0}     label="In Progress"       color="#2563ff" />
              <StatCard icon="🏆" value={stats.certificates ?? 0}   label="Certificates"      color="#f0a500" />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:16 }}>
              {/* Continue Learning */}
              <div style={{ background:'white', borderRadius:14, padding:20, boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
                  <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:15, fontWeight:700, color:'#1a1a2e' }}>Continue Learning</h2>
                  <span onClick={() => navigate('/courses')} style={{ fontSize:12, color:'#e8490f', cursor:'pointer' }}>View all →</span>
                </div>

                {enrollments.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'32px 0', color:'#6b6880', fontSize:13 }}>
                    <div style={{ fontSize:40, marginBottom:10 }}>📚</div>
                    No courses yet.{' '}
                    <span onClick={() => navigate('/courses')} style={{ color:'#e8490f', cursor:'pointer', fontWeight:500 }}>Browse courses</span>
                  </div>
                ) : (
                  enrollments.slice(0, 4).map((enr, i) => (
                    <div key={enr.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom: i < enrollments.slice(0,4).length-1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                      <div style={{ width:42, height:42, borderRadius:10, background:'rgba(232,73,15,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                        {enr.course?.thumbnail || '📚'}
                      </div>
                      <div style={{ flex:1, overflow:'hidden' }}>
                        <div style={{ fontSize:13, fontWeight:500, color:'#1a1a2e', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{enr.course?.title}</div>
                        <div style={{ fontSize:11, color:'#6b6880', marginTop:2 }}>{enr.progress}% complete</div>
                        <div className="progress-track" style={{ marginTop:6 }}>
                          <div className="progress-fill" style={{ width:`${enr.progress}%`, background: enr.progress === 100 ? '#00b894' : '#e8490f' }}></div>
                        </div>
                      </div>
                      {enr.completed && <span style={{ fontSize:18 }}>🏆</span>}
                    </div>
                  ))
                )}
              </div>

              {/* Right column */}
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {/* Weekly activity */}
                <div style={{ background:'white', borderRadius:14, padding:18, boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
                  <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:14, fontWeight:700, color:'#1a1a2e', marginBottom:14 }}>Weekly Activity</h2>
                  <div style={{ display:'flex', gap:6, alignItems:'flex-end', height:60 }}>
                    {[40,70,55,90,65,80,50].map((h, i) => (
                      <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                        <div style={{ width:'100%', background: i===today ? '#e8490f' : 'rgba(0,0,0,0.06)', borderRadius:4, height:`${h}%`, transition:'height 0.3s' }}></div>
                        <span style={{ fontSize:9, color: i===today ? '#e8490f' : '#6b6880', fontWeight: i===today ? 600 : 400 }}>{days[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent quizzes */}
                <div style={{ background:'white', borderRadius:14, padding:18, boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
                  <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:14, fontWeight:700, color:'#1a1a2e', marginBottom:14 }}>Recent Quizzes</h2>
                  {results.length === 0 ? (
                    <div style={{ fontSize:12, color:'#6b6880', textAlign:'center', padding:'12px 0' }}>No quiz results yet</div>
                  ) : (
                    results.slice(0, 3).map(r => (
                      <div key={r.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(0,0,0,0.04)' }}>
                        <div>
                          <div style={{ fontSize:12, fontWeight:500 }}>{r.quiz?.title}</div>
                          <div style={{ fontSize:11, color:'#6b6880' }}>{r.correctAnswers}/{r.totalQuestions} correct</div>
                        </div>
                        <span style={{ fontFamily:'Syne,sans-serif', fontSize:16, fontWeight:700, color: r.passed ? '#00b894' : '#e8490f' }}>{r.score}%</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
