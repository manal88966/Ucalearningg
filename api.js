import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
}

export const userAPI = {
  getById:        (id)        => api.get(`/users/${id}`),
  updateProfile:  (id, data)  => api.put(`/users/${id}`, data),
  changePassword: (id, data)  => api.put(`/users/${id}/password`, data),
}

export const courseAPI = {
  getAll:    ()               => api.get('/courses/public'),
  search:    (q)              => api.get(`/courses/public/search?q=${q}`),
  getById:   (id)             => api.get(`/courses/public/${id}`),
  getByProf: (profId)         => api.get(`/courses/professor/${profId}`),
  create:    (data, profId)   => api.post(`/courses/professor/${profId}`, data),
  update:    (id, data)       => api.put(`/courses/${id}`, data),
  delete:    (id)             => api.delete(`/courses/${id}`),
  publish:   (id)             => api.patch(`/courses/${id}/publish`),
}

export const enrollAPI = {
  enroll:         (studentId, courseId) => api.post(`/enrollments/enroll?studentId=${studentId}&courseId=${courseId}`),
  getByStudent:   (studentId)           => api.get(`/enrollments/student/${studentId}`),
  updateProgress: (enrollId, progress)  => api.patch(`/enrollments/${enrollId}/progress?progress=${progress}`),
  getStats:       (studentId)           => api.get(`/enrollments/student/${studentId}/stats`),
}

export const quizAPI = {
  getByCourse: (courseId)               => api.get(`/quizzes/course/${courseId}`),
  getById:     (quizId)                 => api.get(`/quizzes/${quizId}`),
  create:      (data, courseId)         => api.post(`/quizzes/course/${courseId}`, data),
  submit:      (quizId, studentId, ans) => api.post(`/quizzes/${quizId}/submit?studentId=${studentId}`, ans),
  getResults:  (studentId)              => api.get(`/quizzes/student/${studentId}/results`),
}

export const adminAPI = {
  getStats:   ()    => api.get('/admin/stats'),
  getUsers:   ()    => api.get('/admin/users'),
  deleteUser: (id)  => api.delete(`/admin/users/${id}`),
  toggleUser: (id)  => api.patch(`/admin/users/${id}/toggle`),
}

export default api
