import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import API from '../services/api'

function ProductDetails() {

  const { id } =
    useParams()

  const navigate =
    useNavigate()

  const [product,
    setProduct] =
    useState(null)

  const [quantity,
    setQuantity] =
    useState(1)

  const [rating,
    setRating] =
    useState(5)

  const [comment,
    setComment] =
    useState('')

  const [loading,
    setLoading] =
    useState(true)

  const [error,
    setError] =
    useState('')


  // VARIANT STATES

  const [selectedSize,
    setSelectedSize] =
    useState('')

  const [selectedColor,
    setSelectedColor] =
    useState('')


  const imageUrl =
    useMemo(() => {

      if (!product?.image)
        return ''

      return `${import.meta.env.VITE_API_UPLOADS_URL}/${product.image}`

    }, [product])


  const fetchProduct =
    async () => {

      try {

        const { data } =
          await API.get(
            `/api/products/${id}`
          )

        setProduct(data)

      } catch (error) {

        setError(
          'Failed to load product'
        )

      } finally {

        setLoading(false)
      }
    }


  useEffect(() => {

    fetchProduct()

  }, [id])


  // UNIQUE SIZES

  const sizes =
    product?.variants
      ? [
        ...new Set(
          product.variants.map(
            (v) => v.size
          )
        )
      ]
      : []


  // UNIQUE COLORS

  const colors =
    product?.variants
      ? [
        ...new Set(

          product.variants

            .filter(
              (v) =>

                v.size ===
                selectedSize
            )

            .map(
              (v) => v.color
            )

        )
      ]
      : []


  // SELECTED VARIANT

  const selectedVariant =
    product?.variants?.find(

      (v) =>

        v.size ===
        selectedSize &&

        v.color ===
        selectedColor
    )


  const handleAddToCart =
    async () => {

      const token =
        localStorage.getItem(
          'token'
        )

      if (!token) {

        navigate('/login')

        return
      }

      // CHECK VARIANT

      if (
        !selectedSize ||
        !selectedColor
      ) {

        alert(
          'Please select size and color'
        )

        return
      }

      try {

        await API.post(
          '/api/cart/add',
          {
            productId: id,

            quantity,

            size:
              selectedSize,

            color:
              selectedColor,

            price:
              selectedVariant.price,
          }
        )

        navigate('/cart')

      } catch (error) {

        console.log(error)
      }
    }


  const submitReview =
    async (e) => {

      e.preventDefault()

      try {

        await API.post(

          `/api/products/${id}/reviews`,

          {
            rating,
            comment,
          }

        )

        alert(
          'Review Added'
        )

        setComment('')

        fetchProduct()

      } catch (error) {

        alert(
          error.response.data.message
        )
      }
    }


  if (loading) {

    return (

      <div className='min-h-screen flex items-center justify-center'>
        Loading...
      </div>

    )
  }


  if (!product) {

    return (

      <div className='min-h-screen p-10'>
        Product not found
      </div>

    )
  }


  return (

    <div className='min-h-screen bg-gray-100 p-10'>

      <div className='max-w-6xl mx-auto bg-white rounded-3xl p-10 shadow-lg'>

        <div className='grid md:grid-cols-2 gap-10'>

          <div>

            <img
              src={imageUrl}
              alt={product.name}
              className='w-full h-[500px] object-cover rounded-3xl'
            />

          </div>

          <div>

            <h1 className='text-5xl font-bold mb-4'>
              {product.name}
            </h1>

            <div className='flex items-center gap-3 mb-5'>

              <span className='text-yellow-500 text-2xl'>
                ⭐
              </span>

              <span className='text-xl font-bold'>

                {product.rating
                  ?.toFixed(1)}

              </span>

              <span className='text-gray-500'>

                (
                {product.numReviews}
                {' '}
                reviews
                )

              </span>

            </div>


            {/* SIZE SELECT */}

            <div className='mb-5'>

              <label className='font-bold block mb-2'>
                Select Size
              </label>

              <select
                value={selectedSize}
                onChange={(e) => {

                  setSelectedSize(
                    e.target.value
                  )

                  setSelectedColor('')
                }}
                className='border p-4 rounded-xl w-full'
              >

                <option value=''>
                  Select Size
                </option>

                {sizes.map(
                  (size) => (

                    <option
                      key={size}
                      value={size}
                    >
                      {size}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* COLOR SELECT */}

            <div className='mb-5'>

              <label className='font-bold block mb-2'>
                Select Color
              </label>

              <select
                value={selectedColor}
                onChange={(e) =>
                  setSelectedColor(
                    e.target.value
                  )
                }
                className='border p-4 rounded-xl w-full'
              >

                <option value=''>
                  Select Color
                </option>

                {colors.map(
                  (color) => (

                    <option
                      key={color}
                      value={color}
                    >
                      {color}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* VARIANT PRICE */}

            {
              selectedVariant && (

                <div className='mb-5'>

                  <h2 className='text-4xl text-green-600 font-bold mb-3'>
                    ₹
                    {selectedVariant.price}
                  </h2>

                  <p className='text-lg'>

                    Stock:
                    {' '}

                    <span className='font-bold'>

                      {selectedVariant.stock}

                    </span>

                  </p>

                </div>

              )
            }


            <p className='text-gray-700 text-lg leading-8 mb-8'>
              {product.description}
            </p>


            {/* QUANTITY */}

            <div className='flex items-center gap-4 mb-8'>

              <label className='font-bold'>
                Quantity
              </label>

              <input
                type='number'
                min='1'

                max={
                  selectedVariant?.stock || 1
                }

                value={quantity}

                onChange={(e) =>

                  setQuantity(
                    Number(
                      e.target.value
                    )
                  )

                }

                className='border p-3 rounded-xl w-24'
              />

            </div>


            <button
              onClick={
                handleAddToCart
              }

              disabled={
                selectedVariant?.stock === 0
              }

              className='bg-black text-white px-10 py-4 rounded-2xl disabled:bg-gray-400'
            >

              {
                selectedVariant?.stock === 0

                  ? 'Out Of Stock'

                  : 'Add To Cart'
              }

            </button>

          </div>

        </div>


        {/* REVIEWS */}

        <div className='mt-16'>

          <h2 className='text-4xl font-bold mb-8'>
            Reviews
          </h2>


          {/* REVIEW FORM */}

          <form
            onSubmit={submitReview}
            className='bg-gray-100 p-8 rounded-3xl mb-10'
          >

            <h3 className='text-2xl font-bold mb-5'>
              Write a Review
            </h3>

            <select
              value={rating}
              onChange={(e) =>
                setRating(
                  e.target.value
                )
              }
              className='w-full border p-4 rounded-xl mb-5'
            >

              <option value='1'>
                1 Star
              </option>

              <option value='2'>
                2 Stars
              </option>

              <option value='3'>
                3 Stars
              </option>

              <option value='4'>
                4 Stars
              </option>

              <option value='5'>
                5 Stars
              </option>

            </select>

            <textarea
              rows='5'
              placeholder='Write review'
              value={comment}
              onChange={(e) =>
                setComment(
                  e.target.value
                )
              }
              className='w-full border p-4 rounded-xl mb-5'
            ></textarea>

            <button
              type='submit'
              className='bg-black text-white px-8 py-4 rounded-xl'
            >
              Submit Review
            </button>

          </form>


          {/* REVIEW LIST */}

          <div className='space-y-6'>

            {product.reviews
              ?.length === 0 ? (

              <p>
                No Reviews Yet
              </p>

            ) : (

              product.reviews.map(
                (review) => (

                  <div
                    key={review._id}
                    className='bg-white border p-6 rounded-3xl'
                  >

                    <div className='flex items-center justify-between mb-3'>

                      <h3 className='text-2xl font-bold'>
                        {review.name}
                      </h3>

                      <span className='text-yellow-500 text-xl'>
                        {'⭐'.repeat(
                          review.rating
                        )}
                      </span>

                    </div>

                    <p className='text-gray-700'>
                      {review.comment}
                    </p>

                  </div>

                )
              )
            )}

          </div>

        </div>

      </div>

    </div>
  )
}

export default ProductDetails