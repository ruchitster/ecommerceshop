import { useEffect, useState } from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import API from '../../services/api'

function Dashboard() {

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: [],
  })

  // FETCH DASHBOARD STATS
  const fetchStats = async () => {
    try {
      const { data } = await API.get('/orders/dashboard/stats')
      setStats(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className='min-h-screen bg-gray-100 flex'>

      <AdminSidebar />

      <div className='flex-1 p-10'>

        <h1 className='text-5xl font-bold mb-10'>
          Admin Dashboard
        </h1>

        {/* STATS */}
        <div className='grid md:grid-cols-4 gap-6 mb-10'>

          <div className='bg-white p-8 rounded-3xl shadow-lg'>
            <h2 className='text-5xl font-bold'>
              {stats.totalProducts}
            </h2>
            <p className='text-gray-600 mt-2'>Products</p>
          </div>

          <div className='bg-white p-8 rounded-3xl shadow-lg'>
            <h2 className='text-5xl font-bold text-blue-600'>
              {stats.totalOrders}
            </h2>
            <p className='text-gray-600 mt-2'>Orders</p>
          </div>

          <div className='bg-white p-8 rounded-3xl shadow-lg'>
            <h2 className='text-5xl font-bold text-green-600'>
              {stats.totalUsers}
            </h2>
            <p className='text-gray-600 mt-2'>Users</p>
          </div>

          <div className='bg-white p-8 rounded-3xl shadow-lg'>
            <h2 className='text-4xl font-bold text-purple-600'>
              ₹{stats.totalRevenue}
            </h2>
            <p className='text-gray-600 mt-2'>Revenue</p>
          </div>

        </div>

        {/* LOW STOCK */}
        <div className='bg-white p-8 rounded-3xl shadow-lg mb-10'>
          <h2 className='text-3xl font-bold mb-6'>
            Low Stock Products
          </h2>

          {stats.lowStockProducts.length === 0 ? (
            <p>No low stock products</p>
          ) : (
            stats.lowStockProducts.map((product) => (
              <div key={product._id} className='border-b pb-4'>
                <h3 className='font-bold text-lg'>
                  {product.name}
                </h3>

                <div className='mt-2 flex flex-wrap gap-2'>
                  {product.variants
                    ?.filter(v => v.stock <= 5)
                    .map((variant, index) => (
                      <div
                        key={index}
                        className='bg-red-100 text-red-600 px-3 py-2 rounded-xl text-sm'
                      >
                        {variant.size} / {variant.color} - Stock: {variant.stock}
                      </div>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* RECENT ORDERS */}
        <div className='bg-white p-8 rounded-3xl shadow-lg mb-10'>
          <h2 className='text-3xl font-bold mb-6'>
            Recent Orders
          </h2>

          <div className='space-y-5'>
            {stats.recentOrders.map((order) => (
              <div
                key={order._id}
                className='border rounded-2xl p-5 flex justify-between'
              >
                <div>
                  <h3 className='text-xl font-bold'>
                    {order.user?.name}
                  </h3>
                  <p className='text-gray-500'>
                    {order.user?.email}
                  </p>
                </div>

                <div className='text-right'>
                  <h3 className='font-bold text-green-600'>
                    ₹{order.totalAmount}
                  </h3>
                  <p>{order.orderStatus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard