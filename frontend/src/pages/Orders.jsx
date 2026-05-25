import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')

      const { data } = await API.get('/orders/my-orders')

      setOrders(data || [])
    } catch (error) {
      console.log(error)
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading orders...
      </div>
    )
  }

  // ERROR UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl shadow-lg">
            No Orders Yet
          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order._id}
                onClick={() => navigate(`/orders/${order._id}`)}
                className="bg-white p-6 rounded-3xl shadow-lg cursor-pointer hover:shadow-xl transition"
              >

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">

                  <div>
                    <h2 className="text-2xl font-bold">
                      Order #{order._id.slice(-6)}
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span className="font-bold text-green-600 text-lg">
                    {order.orderStatus}
                  </span>

                </div>

                {/* ITEMS PREVIEW */}
                <div className="text-gray-600">
                  {(order.items || []).slice(0, 2).map((item, index) => (
                    <p key={index}>
                      • {item.product?.name || 'Deleted Product'} × {item.quantity}
                    </p>
                  ))}

                  {(order.items || []).length > 2 && (
                    <p className="text-sm text-gray-400">
                      +{order.items.length - 2} more items
                    </p>
                  )}
                </div>

                {/* TOTAL */}
                <div className="mt-5 text-right border-t pt-4">
                  <h3 className="text-xl font-bold text-green-600">
                    Total: ₹{order.totalAmount}
                  </h3>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  )
}

export default Orders