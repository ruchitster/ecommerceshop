import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../services/api'

function AdminLogin() {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {

    e.preventDefault()

    try {

      setLoading(true)
      setError('')

      const { data } =
        await API.post(
          '/auth/admin/login',
          {
            email,
            password,
          }
        )

      // CHECK ADMIN
      if (data.user.role !== 'admin') {

        setError('Access denied')

        return
      }

      localStorage.setItem(
        'token',
        data.token
      )

      localStorage.setItem(
        'user',
        JSON.stringify(data.user)
      )

      navigate('/admin/dashboard')

    } catch (error) {

      console.log(error)

      setError(
        error.response?.data?.message ||
        'Admin login failed'
      )

    } finally {

      setLoading(false)

    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Admin Login
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded-xl"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded-xl"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800"
          >
            {loading
              ? 'Logging in...'
              : 'Login as Admin'}
          </button>

        </form>

      </div>

    </div>
  )
}

export default AdminLogin