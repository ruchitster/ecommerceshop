import { useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import API from '../services/api'

function Auth() {

  const navigate = useNavigate()
  const location = useLocation()

  const initialMode = useMemo(() => {

    const p = location?.pathname || ''

    if (p.includes('register')) {
      return 'register'
    }

    return 'login'

  }, [location?.pathname])

  const [mode, setMode] = useState(initialMode)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {

    setError('')

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // =========================
  // SUBMIT
  // =========================
  const submit = async (e) => {

    e.preventDefault()

    setLoading(true)
    setError('')

    try {

      // =========================
      // LOGIN FIRST
      // =========================

      const loginRes = await API.post(
        '/api/auth/login',
        {
          email: formData.email,
          password: formData.password,
        }
      )

      console.log('Login Success:', loginRes.data)

      const { token, user } = loginRes.data

      localStorage.setItem('token', token)

      localStorage.setItem(
        'user',
        JSON.stringify(user)
      )

      if (user?.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }

      return

    } catch (loginErr) {

      console.log('Login Error:', loginErr)

      // =========================
      // REGISTER IF LOGIN FAILS
      // =========================

      try {

        const registerPayload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }

        await API.post(
          '/api/auth/register',
          registerPayload
        )

        console.log('Register Success')

        // =========================
        // LOGIN AFTER REGISTER
        // =========================

        const loginRes2 = await API.post(
          '/api/auth/login',
          {
            email: formData.email,
            password: formData.password,
          }
        )

        console.log(
          'Login After Register:',
          loginRes2.data
        )

        const { token, user } = loginRes2.data

        localStorage.setItem('token', token)

        localStorage.setItem(
          'user',
          JSON.stringify(user)
        )

        if (user?.role === 'admin') {
          navigate('/admin/dashboard')
        } else {
          navigate('/')
        }

      } catch (regErr) {

        console.log('Register Error:', regErr)

        const msg =
          regErr?.response?.data?.message ||
          'Authentication failed'

        setError(msg)
      }

    } finally {

      setLoading(false)

    }
  }

  return (

    <div className='flex items-center justify-center min-h-screen bg-gray-100'>

      <div className='bg-white shadow-2xl rounded-2xl p-8 w-[430px]'>

        {/* HEADER */}
        <div className='flex gap-3 mb-6'>

          <button
            type='button'
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-xl border transition ${
              mode === 'login'
                ? 'bg-black text-white'
                : 'bg-white text-black'
            }`}
          >
            Login
          </button>

          <button
            type='button'
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-xl border transition ${
              mode === 'register'
                ? 'bg-black text-white'
                : 'bg-white text-black'
            }`}
          >
            Register
          </button>

        </div>

        {/* FORM */}
        <form onSubmit={submit}>

          {mode === 'register' ? (

            <input
              type='text'
              name='name'
              placeholder='Enter Name'
              className='w-full border p-3 rounded-xl mb-4'
              onChange={handleChange}
              value={formData.name}
              required
            />

          ) : (

            <div className='mb-4 text-sm text-gray-600'>
              If account does not exist, it will auto-register.
            </div>

          )}

          <input
            type='email'
            name='email'
            placeholder='Enter Email'
            className='w-full border p-3 rounded-xl mb-4'
            onChange={handleChange}
            value={formData.email}
            required
          />

          <input
            type='password'
            name='password'
            placeholder='Enter Password'
            className='w-full border p-3 rounded-xl mb-4'
            onChange={handleChange}
            value={formData.password}
            required
          />

          {/* ERROR */}
          {error && (

            <div className='mb-4 text-red-600 text-sm'>
              {error}
            </div>

          )}

          {/* BUTTON */}
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 disabled:opacity-70'
          >
            {loading
              ? 'Please wait...'
              : mode === 'register'
              ? 'Register'
              : 'Login'}
          </button>

          <div className='text-center mt-4 text-sm text-gray-600'>
            By continuing, you agree to the app terms.
          </div>

        </form>

      </div>

    </div>
  )
}

export default Auth