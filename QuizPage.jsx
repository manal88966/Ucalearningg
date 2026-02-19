import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { quizAPI } from '../services/api'

export default function QuizPage() {
  const { quizId }        = useParams()
  const { user }          = useAuth()
  const navigate          = useNavigate()
  const [quiz, setQuiz]   = useState(null)
  const [answers, setAnswers] = useState({})
  const [current, setCurrent] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    quizAPI.getById(quizId).then(res => {
      setQuiz(res.data)
      setTimeLeft((res.data.timeLimitMinutes || 10) * 60)
      setLoading(false)
    })
  }, [quizId])

  // Timer
  useEffect(() => {
    if (!quiz || submitted) return
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(interval); handleSubmit(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [quiz, submitted])

  const handleSubmit = useCallback(async () => {
    if (submitted) return
    setSubmitted(true)
    try {
      const res = await quizAPI.submit(quizId, user.id, answers)
      setResult(res.data)
    } catch(e) { console.error(e) }
  }, [quizId, user.id, answers, submitted])

  if (loading) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0d0d14' }}><div className="spinner" style={{ width:40, height:40, borderWidth:3, borderColor:'rgba(255,255,255,0.1)', borderTopColor:'#e8490f' }}></div></div>
  if (!quiz)   return null

  const questions = quiz.questions || []
  const q         = questions[current]
  const mins      = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const secs      = String(timeLeft % 60).padStart(2, '0')
  const progress  = questions.length ? ((current + 1) / questions.length) * 100 : 0

  if (result) {
    return (
      <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0d0d14,#1a1030)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
        <div className="animate-fade-up" style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:24, padding:48, maxWidth:440, width:'100%', textAlign:'center' }}>
          <div style={{ fontSize:64, marginBottom:16 }}>{result.passed ? '🎉' : '😅'}</div>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:28, fontWeight:700, color:'white', marginBottom:8 }}>{result.passed ? 'You Passed!' : 'Not Quite'}</h1>
          <p style={{ color:'rgba(255,255,255,0.4)', marginBottom:28 }}>{result.passed ? 'Great job! Keep it up.' : `You need ${quiz.passingScore}% to pass. Try again!`}</p>

          <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:16, padding:24, marginBottom:28 }}>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:52, fontWeight:800, color: result.passed ? '#00b894' : '#e8490f' }}>{result.score}%</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginTop:4 }}>{result.correctAnswers} / {result.totalQuestions} correct answers</div>
          </div>

          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => navigate(-1)} className="btn-outline" style={{ flex:1, color:'rgba(255,255,255,0.6)', borderColor:'rgba(255,255,255,0.15)' }}>← Back</button>
            <button onClick={() => { setSubmitted(false); setResult(null); setAnswers({}); setCurrent(0); setTimeLeft((quiz.timeLimitMinutes||10)*60) }} className="btn-flame" style={{ flex:1, justifyContent:'center' }}>Try Again</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0d0d14,#1a1030)', padding:'32px 24px', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 80% 20%, rgba(232,73,15,0.07) 0%, transparent 60%)', pointerEvents:'none' }} />

      <div style={{ maxWidth:640, margin:'0 auto', position:'relative' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:32 }}>
          <button onClick={() => navigate(-1)} style={{ background:'rgba(255,255,255,0.06)', border:'none', borderRadius:10, width:38, height:38, color:'rgba(255,255,255,0.6)', fontSize:18, cursor:'pointer' }}>←</button>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'rgba(255,255,255,0.35)', marginBottom:6 }}>
              <span>Question {current + 1} of {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div style={{ height:6, background:'rgba(255,255,255,0.08)', borderRadius:100, overflow:'hidden' }}>
              <div style={{ height:'100%', background:'#e8490f', borderRadius:100, width:`${progress}%`, transition:'width 0.4s ease' }}></div>
            </div>
          </div>
          <div style={{ background:'rgba(232,73,15,0.15)', border:'1px solid rgba(232,73,15,0.3)', color:'#ff6b3d', padding:'7px 14px', borderRadius:100, fontFamily:'Syne,sans-serif', fontSize:15, fontWeight:700 }}>
            ⏱ {mins}:{secs}
          </div>
        </div>

        {/* Question */}
        <div className="animate-fade-in" style={{ marginBottom:28 }}>
          <div style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.3)', letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Question {current + 1}</div>
          <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:20, fontWeight:600, color:'white', lineHeight:1.4 }}>{q.questionText}</h2>
        </div>

        {/* Options */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:28 }}>
          {['A','B','C','D'].map(letter => {
            const text = q[`option${letter}`]
            if (!text) return null
            const selected = answers[q.id] === letter
            return (
              <div key={letter} onClick={() => setAnswers({...answers, [q.id]: letter})}
                style={{
                  background: selected ? 'rgba(232,73,15,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1.5px solid ${selected ? '#e8490f' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius:14, padding:'14px 16px', display:'flex', alignItems:'center',
                  gap:12, cursor:'pointer', transition:'all 0.2s'
                }}>
                <div style={{ width:30, height:30, borderRadius:8, background: selected ? '#e8490f' : 'rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0 }}>{letter}</div>
                <span style={{ fontSize:13, color:'rgba(255,255,255,0.85)' }}>{text}</span>
              </div>
            )
          })}
        </div>

        {/* Dots */}
        <div style={{ display:'flex', justifyContent:'center', gap:6, marginBottom:24 }}>
          {questions.map((_, i) => (
            <div key={i} onClick={() => setCurrent(i)} style={{ width:10, height:10, borderRadius:'50%', cursor:'pointer', background: i === current ? '#e8490f' : answers[questions[i]?.id] ? '#00b894' : 'rgba(255,255,255,0.15)', transition:'all 0.2s' }}></div>
          ))}
        </div>

        {/* Navigation */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
            style={{ padding:'11px 20px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, color:'rgba(255,255,255,0.4)', fontSize:13, cursor:current===0?'default':'pointer', opacity:current===0?0.4:1 }}>
            ← Previous
          </button>

          {current < questions.length - 1 ? (
            <button onClick={() => setCurrent(current + 1)} className="btn-flame">
              Next Question →
            </button>
          ) : (
            <button onClick={handleSubmit} style={{ padding:'11px 24px', background:'#00b894', border:'none', borderRadius:10, color:'white', fontSize:14, fontWeight:600, fontFamily:'Syne,sans-serif', cursor:'pointer' }}>
              Submit Quiz ✓
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
