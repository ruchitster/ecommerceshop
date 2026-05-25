import { useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import API from '../services/api'

function Auth() {
  const navigate = useNavigate()
  const location = useLocation()

  const initialMode = useMemo(() => {
    const p = location?.pathname || ''
    if (p.includes('register')) return 'register'
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

  const handleChange = (e) => {
    setError('')
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Required behavior per task:
      // if user exists -> login, else -> register, then login.
      // Since backend currently doesn't expose a check endpoint, we attempt login first.
      // If invalid credentials happens, we interpret it as "email not registered" and register.

      const loginRes = await API.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      })

      const { token, user } = loginRes.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      if (user?.role === 'admin') navigate('/admin/dashboard')
      else navigate('/')
      return
    } catch (loginErr) {
      // fallback: if login fails, register then login
      try {
        const registerPayload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }

        await API.post('/auth/register', registerPayload)

        // login after successful register
        const loginRes2 = await API.post('/auth/login', {
          email: formData.email,
          password: formData.password,
        })

        const { token, user } = loginRes2.data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

        if (user?.role === 'admin') navigate('/admin/dashboard')
        else navigate('/')
      } catch (regErr) {
        const msg = regErr?.response?.data?.message || 'Authentication failed'
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='bg-white shadow-lg rounded-2xl p-8 w-[430px]'>
        <div className='flex gap-3 mb-6'>
          <button
            type='button'
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-xl border ${
              mode === 'login' ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            Login
          </button>
          <button
            type='button'
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-xl border ${
              mode === 'register' ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={submit}>
          {mode === 'register' ? (
            <input
              type='text'
              name='name'
              placeholder='Enter Name'
              className='w-full border p-3 rounded-xl mb-4'
              onChange={handleChange}
              value={formData.name}
            />
          ) : (
            <div className='mb-4 text-sm text-gray-600'>
              {"Tip: If the email isn't registered, submitting will auto-register."}
            </div>
          )}

          <input
            type='email'
            name='email'
            placeholder='Enter Email'
            className='w-full border p-3 rounded-xl mb-4'
            onChange={handleChange}
            value={formData.email}
          />

          <input
            type='password'
            name='password'
            placeholder='Enter Password'
            className='w-full border p-3 rounded-xl mb-4'
            onChange={handleChange}
            value={formData.password}
          />

          {error ? (
            <div className='mb-4 text-red-600 text-sm'>
              {error}
            </div>
          ) : null}

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-black text-white py-3 rounded-xl disabled:opacity-70'
          >
            {loading ? 'Please wait...' : mode === 'register' ? 'Submit' : 'Login / Register'}
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

