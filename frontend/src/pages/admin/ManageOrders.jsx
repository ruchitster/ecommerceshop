import {
  useEffect,
  useState,
} from 'react'

import API from '../../services/api'

import AdminSidebar from '../../components/admin/AdminSidebar'


function ManageOrders() {

  const [orders,
    setOrders] =
    useState([])


  const fetchOrders =
    async () => {

      try {

        const { data } =
          await API.get(
            '/orders'
          )

        setOrders(data)

      } catch (error) {

        console.log(error)
      }
    }


  useEffect(() => {

    fetchOrders()

  }, [])


  const updateStatus =
    async (
      orderId,
      status
    ) => {

      try {

        await API.put(
          `/orders/${orderId}`,
          { status }
        )

        fetchOrders()

      } catch (error) {

        console.log(error)
      }
    }


  return (

    <div className='flex'>

      <AdminSidebar />

      <div className='flex-1 p-10 bg-gray-100 min-h-screen'>

        <h1 className='text-5xl font-bold mb-10'>
          Manage Orders
        </h1>


        {orders.length === 0 ? (

          <div className='bg-white p-8 rounded-3xl shadow-lg'>

            No Orders Found

          </div>

        ) : (

          <div className='space-y-8'>

            {orders.map(
              (order) => (

                <div
                  key={order._id}
                  className='bg-white p-8 rounded-3xl shadow-lg'
                >

                  {/* HEADER */}

                  <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8'>

                    <div>

                      <h2 className='text-2xl font-bold'>

                        {order.user
                          ? order.user.name
                          : 'Deleted User'}

                      </h2>

                      <p className='text-gray-500'>

                        {order.user
                          ? order.user.email
                          : 'No Email'}

                      </p>

                    </div>


                    <select
                      value={
                        order.orderStatus
                      }

                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }

                      className='border p-3 rounded-xl'
                    >

                      <option>
                        Pending
                      </option>

                      <option>
                        Processing
                      </option>

                      <option>
                        Shipped
                      </option>

                      <option>
                        Delivered
                      </option>

                    </select>

                  </div>


                  {/* ORDER ITEMS */}

                  <div className='space-y-5'>

                    {order.items.map(
                      (
                        item,
                        index
                      ) => (

                        <div
                          key={index}
                          className='border rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-5'
                        >

                          {/* LEFT */}

                          <div className='flex items-center gap-5'>

                            {item.product && (

                              <img
src={`${import.meta.env.VITE_API_UPLOADS_URL}/${item.product.image}`}
                                alt={item.product.name}
                                className='w-24 h-24 rounded-2xl object-cover'
                              />

                            )}

                            <div>

                              <h3 className='text-xl font-bold mb-2'>

                                {item.product
                                  ? item.product.name
                                  : 'Product Deleted'}

                              </h3>


                              {/* VARIANT */}

                              <div className='flex gap-3 mb-3'>

                                <span className='bg-gray-100 px-3 py-1 rounded-xl text-sm'>

                                  Size:
                                  {' '}
                                  {item.size}

                                </span>

                                <span className='bg-gray-100 px-3 py-1 rounded-xl text-sm'>

                                  Color:
                                  {' '}
                                  {item.color}

                                </span>

                              </div>


                              <p className='text-gray-600'>

                                Price:
                                {' '}
                                ₹{item.price}

                              </p>

                              <p className='text-gray-600'>

                                Quantity:
                                {' '}
                                {item.quantity}

                              </p>

                            </div>

                          </div>


                          {/* RIGHT */}

                          <div className='text-right'>

                            <h3 className='text-2xl font-bold text-green-600'>

                              ₹
                              {
                                item.price *
                                item.quantity
                              }

                            </h3>

                          </div>

                        </div>

                      )
                    )}

                  </div>


                  {/* FOOTER */}

                  <div className='mt-8 border-t pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-8'>

                    {/* SHIPPING */}

                    <div>

                      <h3 className='font-bold text-lg mb-3'>
                        Shipping Address
                      </h3>

                      <p>
                        {
                          order.shippingAddress
                            ?.fullName
                        }
                      </p>

                      <p>
                        {
                          order.shippingAddress
                            ?.phone
                        }
                      </p>

                      <p>
                        {
                          order.shippingAddress
                            ?.address
                        }
                      </p>

                      <p>
                        {
                          order.shippingAddress
                            ?.city
                        }
                      </p>

                      <p>
                        {
                          order.shippingAddress
                            ?.postalCode
                        }
                      </p>

                    </div>


                    {/* TOTAL */}

                    <div className='text-right'>

                      <h2 className='text-4xl font-bold text-green-600'>

                        ₹
                        {
                          order.totalAmount
                        }

                      </h2>

                      <p className='text-sm text-gray-500 mt-2'>

                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}

                      </p>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  )
}

export default ManageOrders