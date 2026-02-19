import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage      from './pages/LoginPage'
import RegisterPage   from './pages/RegisterPage'
import StudentDash    from './pages/StudentDashboard'
import ProfessorDash  from './pages/ProfessorDashboard'
import AdminDash      from './pages/AdminDashboard'
import CoursesPage    from './pages/CoursesPage'
import QuizPage       from './pages/QuizPage'
import ChatbotPage    from './pages/ChatbotPage'
import ProfilePage    from './pages/ProfilePage'
import './index.css'

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
      <div className="spinner" style={{ width:32, height:32, borderWidth:3, borderColor:'rgba(0,0,0,0.1)', borderTopColor:'#e8490f' }}></div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />
  return children
}

function HomeRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'STUDENT')   return <Navigate to="/student/dashboard" replace />
  if (user.role === 'PROFESSOR') return <Navigate to="/professor/dashboard" replace />
  if (user.role === 'ADMIN')     return <Navigate to="/admin/dashboard" replace />
  return <Navigate to="/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"         element={<HomeRedirect />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          }/>

          <Route path="/student/dashboard" element={
            <ProtectedRoute roles={['STUDENT']}><StudentDash /></ProtectedRoute>
          }/>
          <Route path="/courses" element={
            <ProtectedRoute><CoursesPage /></ProtectedRoute>
          }/>
          <Route path="/quiz/:quizId" element={
            <ProtectedRoute roles={['STUDENT']}><QuizPage /></ProtectedRoute>
          }/>
          <Route path="/chat" element={
            <ProtectedRoute><ChatbotPage /></ProtectedRoute>
          }/>
          <Route path="/professor/dashboard" element={
            <ProtectedRoute roles={['PROFESSOR']}><ProfessorDash /></ProtectedRoute>
          }/>
          <Route path="/admin/dashboard" element={
            <ProtectedRoute roles={['ADMIN']}><AdminDash /></ProtectedRoute>
          }/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
