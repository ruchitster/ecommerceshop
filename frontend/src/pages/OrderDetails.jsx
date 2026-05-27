import {
  useEffect,
  useState,
} from 'react'

import {
  useParams,
} from 'react-router-dom'

import API from '../services/api'

function OrderDetails() {

  const { id } =
    useParams()

  const [order,
    setOrder] =
    useState(null)

  const [loading,
    setLoading] =
    useState(true)

  const [error,
    setError] =
    useState('')

  // =========================
  // FETCH ORDER
  // =========================

  const fetchOrder =
    async () => {

      try {

        setLoading(true)
        setError('')

        const { data } =
          await API.get(
            `/orders/${id}`
          )

        console.log(
          'Order:',
          data
        )

        setOrder(data)

      } catch (error) {

        console.log(
          'Order Error:',
          error
        )

        setError(
          error?.response?.data?.message ||
          'Failed to load order'
        )

      } finally {

        setLoading(false)
      }
    }

  useEffect(() => {

    fetchOrder()

  }, [id])

  // =========================
  // DOWNLOAD INVOICE
  // =========================

  const downloadInvoice =
    async () => {

      try {

        const res =
          await API.get(

            `/invoice/${id}`,

            {
              responseType: 'blob',
            }

          )

        const blob =
          new Blob(
            [res.data],
            { type: 'application/pdf' }
          )

        const url =
          window.URL.createObjectURL(blob)

        const a =
          document.createElement('a')

        a.href = url

        a.download =
          `invoice-${id}.pdf`

        document.body.appendChild(a)

        a.click()

        a.remove()

        window.URL.revokeObjectURL(url)

      } catch (error) {

        console.log(
          'Invoice Error:',
          error
        )

        alert(

          error?.response?.data?.message ||

          'Invoice download failed'
        )
      }
    }

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading Order...
      </div>

    )
  }

  // =========================
  // ERROR
  // =========================

  if (error) {

    return (

      <div className="min-h-screen flex items-center justify-center text-red-500 text-2xl font-bold">
        {error}
      </div>

    )
  }

  // =========================
  // ORDER NOT FOUND
  // =========================

  if (!order) {

    return (

      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Order not found
      </div>

    )
  }

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto bg-white p-8 rounded-3xl shadow-lg">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div>

            <h1 className="text-4xl font-bold">

              Order #
              {order._id.slice(-6)}

            </h1>

            <p className="text-gray-500 mt-2">

              {new Date(
                order.createdAt
              ).toLocaleDateString()}

            </p>

          </div>

          <span className="text-green-600 font-bold text-xl">

            {order.orderStatus}

          </span>

        </div>

        {/* ITEMS */}

        <div className="space-y-5">

          {order.items.map(
            (
              item,
              index
            ) => (

              <div
                key={index}
                className="border p-5 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-5"
              >

                {/* LEFT */}

                <div className="flex gap-5">

                  <img
                    src={
                      item.product?.image

                        ? `${import.meta.env.VITE_API_UPLOADS_URL}/${item.product.image}`

                        : 'https://via.placeholder.com/100'
                    }

                    alt={
                      item.product?.name
                    }

                    className="w-24 h-24 object-cover rounded-2xl"
                  />

                  <div>

                    <h2 className="text-xl font-bold mb-2">

                      {item.product?.name ||
                        'Deleted Product'}

                    </h2>

                    <p className="text-gray-500 mb-2">

                      Size:
                      {' '}
                      {item.size || 'N/A'}

                      {' | '}

                      Color:
                      {' '}
                      {item.color || 'N/A'}

                    </p>

                    <p className="text-gray-700">

                      Quantity:
                      {' '}
                      {item.quantity}

                    </p>

                    <p className="text-gray-700">

                      Price:
                      {' '}
                      ₹
                      {item.price}

                    </p>

                  </div>

                </div>

                {/* RIGHT */}

                <div className="text-right">

                  <h3 className="text-2xl font-bold text-green-600">

                    ₹
                    {item.price *
                      item.quantity}

                  </h3>

                </div>

              </div>

            )
          )}

        </div>

        {/* SHIPPING */}

        <div className="mt-10 border-t pt-8">

          <h2 className="text-2xl font-bold mb-5">
            Shipping Address
          </h2>

          <div className="space-y-2 text-gray-700">

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

        </div>

        {/* TOTAL */}

        <div className="mt-10 border-t pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <h2 className="text-4xl font-bold text-green-600">

            Total:
            {' '}

            ₹
            {order.totalAmount}

          </h2>

        </div>

        {/* INVOICE BUTTON */}

        <button
          onClick={downloadInvoice}
          className="mt-8 bg-black text-white px-8 py-4 rounded-2xl hover:bg-gray-800 transition"
        >
          Download Invoice
        </button>

      </div>

    </div>
  )
}

export default OrderDetails