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

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      await API.post(
        '/auth/register',
        formData
      )
   navigate('/login')

    } catch (error) {

      console.log(error)
    }
  }

  return (

    <div className='flex items-center justify-center min-h-screen'>

      <form
        onSubmit={handleSubmit}
        className='bg-white shadow-lg rounded-2xl p-8 w-[400px]'
      >

        <h1 className='text-3xl font-bold mb-6 text-center'>
          Register
        </h1>

        <input
          type='text'
          name='name'
          placeholder='Enter Name'
          className='w-full border p-3 rounded-xl mb-4'
          onChange={handleChange}
        />

        <input
          type='email'
          name='email'
          placeholder='Enter Email'
          className='w-full border p-3 rounded-xl mb-4'
          onChange={handleChange}
        />

        <input
          type='password'
          name='password'
          placeholder='Enter Password'
          className='w-full border p-3 rounded-xl mb-4'
          onChange={handleChange}
        />

        <button
          type='submit'
          className='w-full bg-black text-white py-3 rounded-xl'
        >
          Register
        </button>

      </form>

    </div>
  )
}

export default Register