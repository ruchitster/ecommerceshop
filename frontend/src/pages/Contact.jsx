import {
  useState,
} from 'react'

import API from '../services/api'

function Contact() {

  const [formData, setFormData] =
    useState({
      name: '',
      email: '',
      subject: '',
      message: '',
    })

  const [loading, setLoading] =
    useState(false)

  const [success, setSuccess] =
    useState('')

  const [error, setError] =
    useState('')

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      setLoading(true)
      setError('')
      setSuccess('')

      const { data } = await API.post(
        '/contact',
        formData
      )

      setSuccess(data.message)

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })

    } catch (error) {

      setError(
        error.response?.data?.message ||
        'Something went wrong'
      )

    } finally {

      setLoading(false)
    }
  }

  return (

    <div className="min-h-screen bg-gray-100 py-12 px-6">

      <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-lg">

        <h1 className="text-4xl font-bold mb-8 text-center">
          Contact Us
        </h1>

        {success && (
          <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-5">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-5">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-4 rounded-xl outline-none"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-4 rounded-xl outline-none"
            required
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border p-4 rounded-xl outline-none"
            required
          />

          <textarea
            name="message"
            placeholder="Your Message"
            rows="6"
            value={formData.message}
            onChange={handleChange}
            className="w-full border p-4 rounded-xl outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 transition"
          >
            {
              loading
                ? 'Sending...'
                : 'Send Message'
            }
          </button>

        </form>

      </div>

    </div>
  )
}

export default Contact