import { Navigate } from 'react-router-dom'

function AdminRoute({ children }) {

  const token = localStorage.getItem('token')

  let user = null

  try {
    user = JSON.parse(localStorage.getItem('user') || 'null')
  } catch (err) {
    user = null
  }

  // NOT LOGGED IN
  if (!token || !user) {
    return <Navigate to="/admin/login" />
  }

  // NOT ADMIN
  if (user.role !== 'admin') {
    return <Navigate to="/" />
  }

  return children
}

export default AdminRoute