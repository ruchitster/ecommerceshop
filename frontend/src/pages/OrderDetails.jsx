import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../services/api'

function OrderDetails() {
  const { id } = useParams()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchOrder = async () => {
    try {
      setLoading(true)

      const { data } = await API.get(`/orders/${id}`)

      setOrder(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [id])

  const downloadInvoice = async () => {
    try {
      const token = localStorage.getItem('token')

      const res = await API.get(`/api/invoice/${id}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const blob = res.data
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${id}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()

      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.log(error)
      alert('Invoice download failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading order...
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Order not found
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-lg">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">
              Order #{order._id.slice(-6)}
            </h1>

            <p className="text-gray-500">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <span className="text-green-600 font-bold text-lg">
            {order.orderStatus}
          </span>
        </div>

        {/* ITEMS */}
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="border p-4 rounded-2xl flex justify-between"
            >
              <div className="flex gap-4">
                <img
src={`${import.meta.env.VITE_API_UPLOADS_URL}/${item.product?.image}`}
                  alt=""
                  className="w-20 h-20 object-cover rounded-xl"
                />

                <div>
                  <h2 className="font-bold">
                    {item.product?.name || 'Deleted Product'}
                  </h2>

                  <p className="text-sm text-gray-500">
                    Size: {item.size || 'N/A'} | Color:{' '}
                    {item.color || 'N/A'}
                  </p>

                  <p>Qty: {item.quantity}</p>
                  <p>Price: ₹{item.price}</p>
                </div>
              </div>

              <div className="font-bold text-green-600">
                ₹{item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="mt-6 text-right border-t pt-5">
          <h2 className="text-2xl font-bold text-green-600">
            Total: ₹{order.totalAmount}
          </h2>
        </div>

        {/* INVOICE BUTTON */}
        <button
          onClick={downloadInvoice}
          className="mt-6 bg-black text-white px-6 py-3 rounded-2xl"
        >
          Download Invoice
        </button>

      </div>
    </div>
  )
}

export default OrderDetails