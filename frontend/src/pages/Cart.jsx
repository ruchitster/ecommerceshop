import React, {
  useEffect,
  useState,
} from 'react'

import API from '../services/api'

import {
  useNavigate,
} from 'react-router-dom'


const Cart = () => {

  const [cart, setCart] =
    useState({
      items: [],
    })

  const navigate =
    useNavigate()


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

        setCart({
          items: [],
        })
      }
    }


  // LOAD CART

  useEffect(() => {

    fetchCart()

  }, [])


  // INCREASE QUANTITY

  const increaseQty =
    async (
      productId,
      size,
      color
    ) => {

      try {

        await API.put(
          `/cart/increase`,
          {
            productId,
            size,
            color,
          }
        )

        fetchCart()

      } catch (error) {

        console.log(error)
      }
    }


  // DECREASE QUANTITY

  const decreaseQty =
    async (
      productId,
      size,
      color
    ) => {

      try {

        await API.put(
          `/cart/decrease`,
          {
            productId,
            size,
            color,
          }
        )

        fetchCart()

      } catch (error) {

        console.log(error)
      }
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


  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-4xl mx-auto">

        <h2 className="text-4xl font-bold mb-8">
          My Cart
        </h2>

        {cart?.items?.length === 0 ? (

          <div className="bg-white p-8 rounded-3xl shadow-lg text-center">

            <h4 className="text-2xl font-semibold">
              Cart is Empty
            </h4>

          </div>

        ) : (

          <>

            <div className="space-y-6">

              {cart?.items?.map(
                (
                  item,
                  index
                ) => (

                  <div
                    key={index}
                    className="bg-white rounded-3xl shadow-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                  >

                    {/* PRODUCT INFO */}

                    <div className='flex items-center gap-5'>

                      <img
                        src={`http://localhost:5000/uploads/${item.product.image}`}
                        alt={item.product.name}
                        className='w-24 h-24 rounded-2xl object-cover'
                      />

                      <div>

                        <h3 className="text-2xl font-bold mb-2">
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


                        <p className="text-gray-600 text-lg">

                          Price:

                          <span className="font-semibold text-black ml-2">
                            ₹{item.price}
                          </span>

                        </p>

                        <p className="text-green-600 font-bold text-xl mt-3">

                          Subtotal:
                          {' '}
                          ₹
                          {
                            item.price *
                            item.quantity
                          }

                        </p>

                      </div>

                    </div>


                    {/* QUANTITY */}

                    <div className="flex items-center gap-4">

                      <button
                        onClick={() =>

                          decreaseQty(

                            item.product._id,

                            item.size,

                            item.color
                          )
                        }
                        className="bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-full text-2xl"
                      >
                        -
                      </button>

                      <span className="text-2xl font-bold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>

                          increaseQty(

                            item.product._id,

                            item.size,

                            item.color
                          )
                        }
                        className="bg-green-500 hover:bg-green-600 text-white w-10 h-10 rounded-full text-2xl"
                      >
                        +
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>


            {/* TOTAL */}

            <div className="bg-white rounded-3xl shadow-lg p-8 mt-8 flex items-center justify-between">

              <h3 className="text-3xl font-bold">
                Grand Total
              </h3>

              <span className="text-4xl font-bold text-green-600">
                ₹{totalAmount}
              </span>

            </div>


            {/* CHECKOUT */}

            <button
              onClick={() =>
                navigate('/checkout')
              }
              className="w-full mt-6 bg-black text-white py-4 rounded-2xl text-xl"
            >
              Proceed To Checkout
            </button>

          </>
        )}

      </div>

    </div>
  )
}

export default Cart