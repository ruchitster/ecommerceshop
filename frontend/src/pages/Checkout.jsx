import {
  useEffect,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import API from '../services/api'


function Checkout() {

  const navigate =
    useNavigate()


  const [cart,
    setCart] =
    useState({
      items: [],
    })


  const [loading,
    setLoading] =
    useState(true)


  const [formData,
    setFormData] =
    useState({

      fullName: '',

      phone: '',

      address: '',

      city: '',

      postalCode: '',
    })


  // FETCH CART

  const fetchCart =
    async () => {

      try {

        const { data } =
          await API.get('/cart')

        setCart(
          data.cart || {
            items: [],
          }
        )

      } catch (error) {

        console.log(error)

      } finally {

        setLoading(false)
      }
    }


  useEffect(() => {

    fetchCart()

  }, [])


  // HANDLE CHANGE

  const handleChange =
    (e) => {

      setFormData({

        ...formData,

        [e.target.name]:
          e.target.value,
      })
    }


  // TOTAL

  const totalAmount =

    cart?.items?.reduce(

      (
        total,
        item
      ) =>

        total +

        item.price *
        item.quantity,

      0
    ) || 0


  // SUBMIT

  const handleSubmit =
    async (e) => {

      e.preventDefault()

      try {

        // CREATE PAYMENT ORDER

        const { data } =
          await API.post(
            '/payment/create-order',
            {
              amount:
                totalAmount,
            }
          )


        const options = {

          key:
            'rzp_test_SpgOrdausMLPKf',

          amount:
            data.amount,

          currency:
            data.currency,

          name:
            'Readymade Store',

          description:
            'Order Payment',

          order_id:
            data.id,


          handler:
            async function (
              response
            ) {

              // PLACE ORDER

              await API.post(
                '/orders',
                {
                  shippingAddress:
                    formData,
                }
              )

              alert(
                'Payment Successful'
              )

              navigate(
                '/orders'
              )
            },


          prefill: {

            name:
              formData.fullName,

            contact:
              formData.phone,
          },


          theme: {
            color:
              '#000000',
          },
        }


        const razorpay =
          new window.Razorpay(
            options
          )

        razorpay.open()

      } catch (error) {

        console.log(error)
      }
    }


  if (loading) {

    return (

      <div className='min-h-screen flex items-center justify-center'>

        Loading...

      </div>
    )
  }


  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">


        {/* SHIPPING FORM */}

        <div className="bg-white p-8 rounded-3xl shadow-lg">

          <h1 className="text-4xl font-bold mb-8">
            Checkout
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full border p-4 rounded-xl"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              className="w-full border p-4 rounded-xl"
              required
            />

            <textarea
              name="address"
              placeholder="Address"
              onChange={handleChange}
              className="w-full border p-4 rounded-xl"
              required
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              onChange={handleChange}
              className="w-full border p-4 rounded-xl"
              required
            />

            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              onChange={handleChange}
              className="w-full border p-4 rounded-xl"
              required
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-2xl text-xl"
            >
              Pay ₹{totalAmount}
            </button>

          </form>

        </div>


        {/* ORDER SUMMARY */}

        <div className="bg-white p-8 rounded-3xl shadow-lg h-fit">

          <h2 className="text-3xl font-bold mb-8">
            Order Summary
          </h2>


          <div className='space-y-5'>

            {cart.items.map(
              (
                item,
                index
              ) => (

                <div
                  key={index}
                  className='border rounded-2xl p-4 flex gap-4'
                >

                  <img
                    src={`http://localhost:5000/uploads/${item.product.image}`}
                    alt={item.product.name}
                    className='w-24 h-24 rounded-2xl object-cover'
                  />

                  <div className='flex-1'>

                    <h3 className='text-lg font-bold mb-2'>

                      {item.product.name}

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

                      ₹{item.price}
                      {' '}
                      ×
                      {' '}
                      {item.quantity}

                    </p>

                  </div>


                  <div>

                    <h3 className='font-bold text-green-600 text-xl'>

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


          {/* TOTAL */}

          <div className='border-t mt-8 pt-6 flex items-center justify-between'>

            <h2 className='text-2xl font-bold'>
              Total
            </h2>

            <h2 className='text-3xl font-bold text-green-600'>

              ₹{totalAmount}

            </h2>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Checkout