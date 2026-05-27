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

  // =========================
  // VARIANT STATES
  // =========================

  const [selectedSize,
    setSelectedSize] =
    useState('')

  const [selectedColor,
    setSelectedColor] =
    useState('')

  // =========================
  // IMAGE URL
  // =========================

  const imageUrl =
    useMemo(() => {

      if (!product)
        return 'https://via.placeholder.com/500'

      if (product.image) {

        return `${import.meta.env.VITE_API_UPLOADS_URL}/${product.image}`
      }

      if (
        Array.isArray(product.images) &&
        product.images.length > 0
      ) {

        return `${import.meta.env.VITE_API_UPLOADS_URL}/${product.images[0]}`
      }

      return 'https://via.placeholder.com/500'

    }, [product])

  // =========================
  // FETCH PRODUCT
  // =========================

  const fetchProduct =
    async () => {

      try {

        setLoading(true)
        setError('')

        console.log(
          'Fetching product id:',
          id
        )

        // ✅ FIXED
        const { data } =
          await API.get(
            `/products/${id}`
          )

        console.log(
          'Fetched product:',
          data
        )

        setProduct(data)

      } catch (error) {

        console.log(
          'Product fetch error:',
          error
        )

        setError(
          error?.response?.data?.message ||
          'Failed to load product'
        )

      } finally {

        setLoading(false)
      }
    }

  useEffect(() => {

    if (id) {
      fetchProduct()
    }

  }, [id])

  // =========================
  // UNIQUE SIZES
  // =========================

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

  // =========================
  // UNIQUE COLORS
  // =========================

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

  // =========================
  // SELECTED VARIANT
  // =========================

  const selectedVariant =
    product?.variants?.find(

      (v) =>

        v.size ===
        selectedSize &&

        v.color ===
        selectedColor
    )

  // =========================
  // ADD TO CART
  // =========================

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
          '/cart/add',
          {
            productId: id,

            quantity,

            size:
              selectedSize,

            color:
              selectedColor,

            price:
              selectedVariant.price,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        navigate('/cart')

      } catch (error) {

        console.log(
          'Add to cart error:',
          error
        )

        alert(
          error?.response?.data?.message ||
          'Failed to add to cart'
        )
      }
    }

  // =========================
  // SUBMIT REVIEW
  // =========================

  const submitReview =
    async (e) => {

      e.preventDefault()

      const token =
        localStorage.getItem('token')

      if (!token) {

        navigate('/login')

        return
      }

      try {

        // ✅ FIXED
        await API.post(

          `/products/${id}/reviews`,

          {
            rating,
            comment,
          },

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }

        )

        alert(
          'Review Added'
        )

        setComment('')

        fetchProduct()

      } catch (error) {

        console.log(
          'Review error:',
          error
        )

        alert(
          error?.response?.data?.message ||
          'Failed to submit review'
        )
      }
    }

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div className='min-h-screen flex items-center justify-center text-2xl font-bold'>
        Loading Product...
      </div>

    )
  }

  // =========================
  // ERROR
  // =========================

  if (error) {

    return (

      <div className='min-h-screen flex items-center justify-center text-red-500 text-2xl font-bold'>
        {error}
      </div>

    )
  }

  // =========================
  // PRODUCT NOT FOUND
  // =========================

  if (!product) {

    return (

      <div className='min-h-screen flex items-center justify-center text-2xl font-bold'>
        Product not found
      </div>

    )
  }

  return (

    <div className='min-h-screen bg-gray-100 p-6 md:p-10'>

      <div className='max-w-6xl mx-auto bg-white rounded-3xl p-6 md:p-10 shadow-lg'>

        <div className='grid md:grid-cols-2 gap-10'>

          {/* IMAGE */}

          <div>

            <img
              src={imageUrl}
              alt={product.name}
              className='w-full h-[500px] object-cover rounded-3xl'
            />

          </div>

          {/* DETAILS */}

          <div>

            <h1 className='text-4xl md:text-5xl font-bold mb-4'>
              {product.name}
            </h1>

            <div className='flex items-center gap-3 mb-5'>

              <span className='text-yellow-500 text-2xl'>
                ⭐
              </span>

              <span className='text-xl font-bold'>

                {product.rating
                  ?.toFixed(1) || '0.0'}

              </span>

              <span className='text-gray-500'>

                (
                {product.numReviews || 0}
                {' '}
                reviews
                )

              </span>

            </div>

            {/* SIZE */}

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

            {/* COLOR */}

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

            {/* PRICE */}

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

      </div>

    </div>
  )
}

export default ProductDetails