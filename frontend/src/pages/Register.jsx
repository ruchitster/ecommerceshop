import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import API from '../services/api'

function Register() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
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

    setError('')

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
      // REGISTER API
      // =========================
      const { data } =
        await API.post(
          '/api/auth/register',
          formData
        )

      console.log(
        'Register Success:',
        data
      )

      // =========================
      // REDIRECT TO LOGIN
      // =========================
      navigate('/login')

    } catch (error) {

      console.log(
        'Register Error:',
        error
      )

      setError(

        error.response?.data?.message ||

        'Registration failed'
      )

    } finally {

      setLoading(false)

    }
  }

  return (

    <div className='flex items-center justify-center min-h-screen bg-gray-100 px-4'>

      <form
        onSubmit={handleSubmit}
        className='bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md'
      >

        <h1 className='text-4xl font-bold mb-2 text-center'>
          Register
        </h1>

        <p className='text-gray-500 text-center mb-8'>
          Create your account
        </p>

        {/* ERROR */}
        {error && (

          <div className='bg-red-100 border border-red-300 text-red-600 px-4 py-3 rounded-xl mb-5'>

            {error}

          </div>

        )}

        {/* NAME */}
        <input
          type='text'
          name='name'
          placeholder='Enter Name'
          className='w-full border p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-black'
          onChange={handleChange}
          value={formData.name}
          required
        />

        {/* EMAIL */}
        <input
          type='email'
          name='email'
          placeholder='Enter Email'
          className='w-full border p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-black'
          onChange={handleChange}
          value={formData.email}
          required
        />

        {/* PASSWORD */}
        <input
          type='password'
          name='password'
          placeholder='Enter Password'
          className='w-full border p-3 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-black'
          onChange={handleChange}
          value={formData.password}
          required
        />

        {/* BUTTON */}
        <button
          type='submit'
          disabled={loading}
          className='w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-70'
        >
          {loading
            ? 'Registering...'
            : 'Register'}
        </button>

      </form>

    </div>
  )
}

export default Register