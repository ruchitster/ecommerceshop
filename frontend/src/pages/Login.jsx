import { useState } from 'react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

import API from '../services/api'

function Login() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    })
  }

  // =========================
  // HANDLE SUBMIT
  // =========================
  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      setLoading(true)
      setError('')

      // =========================
      // LOGIN API
      // =========================
      const { data } =
        await API.post(
          '/api/auth/login',
          formData
        )

      console.log('Login Response:', data)

      // =========================
      // BLOCK ADMIN LOGIN
      // =========================
      if (
        data.user?.role === 'admin'
      ) {

        setError(
          'Admins must login from admin panel'
        )

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
      navigate('/')

    } catch (error) {

      console.log(
        'Login Error:',
        error
      )

      setError(

        error.response?.data?.message ||

        'Invalid email or password'
      )

    } finally {

      setLoading(false)

    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md"
      >

        <h1 className="text-4xl font-bold mb-2 text-center">
          User Login
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Welcome back to ShopSphere
        </p>

        {/* ERROR MESSAGE */}
        {error && (

          <div className="bg-red-100 border border-red-300 text-red-600 px-4 py-3 rounded-xl mb-5">

            {error}

          </div>

        )}

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-black"
          required
        />

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-3 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-black"
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
            : 'Login'}
        </button>

        {/* REGISTER */}
        <p className="text-center text-gray-600 mt-6">

          Don't have an account?{' '}

          <Link
            to="/register"
            className="font-semibold text-black hover:underline"
          >
            Register
          </Link>

        </p>

      </form>

    </div>
  )
}

export default Login