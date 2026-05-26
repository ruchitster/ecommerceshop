import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../services/api'

function AdminLogin() {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // =========================
  // HANDLE LOGIN
  // =========================
  const handleLogin = async (e) => {

    e.preventDefault()

    try {

      setLoading(true)
      setError('')

      // =========================
      // ADMIN LOGIN API
      // =========================
      const { data } =
await API.post(
          '/auth/admin/login',
          {
            email,
            password,
          }
        )

      console.log(
        'Admin Login Success:',
        data
      )

      // =========================
      // CHECK ADMIN ROLE
      // =========================
      if (
        data.user?.role !== 'admin'
      ) {

        setError('Access denied')

        return
      }

      // =========================
      // STORE TOKEN
      // =========================
      localStorage.setItem(
        'token',
        data.token
      )

      localStorage.setItem(
        'user',
        JSON.stringify(data.user)
      )

      // =========================
      // REDIRECT
      // =========================
      navigate('/admin/dashboard')

    } catch (error) {

      console.log(
        'Admin Login Error:',
        error
      )

      setError(

        error.response?.data?.message ||

        'Admin login failed'
      )

    } finally {

      setLoading(false)

    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">

        <h1 className="text-4xl font-bold mb-2 text-center">
          Admin Login
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Login to admin dashboard
        </p>

        {/* ERROR */}
        {error && (

          <div className="bg-red-100 border border-red-300 text-red-600 p-3 rounded-xl mb-5">

            {error}

          </div>

        )}

        {/* FORM */}
        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-black"
            required
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-black"
            required
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-70"
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