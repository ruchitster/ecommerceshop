import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/api'

function Home({ search }) {

  const navigate = useNavigate()

  // =========================
  // STATES
  // =========================
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [filteredSubs, setFilteredSubs] = useState([])

  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [sort, setSort] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // =========================
  // HERO IMAGES
  // =========================
  const heroImages = [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b',
  ]

  const [currentImage, setCurrentImage] = useState(0)

  // =========================
  // AUTH CHECK
  // =========================
  useEffect(() => {

    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)

  }, [])

  // =========================
  // HERO ROTATION
  // =========================
  useEffect(() => {

    const interval = setInterval(() => {

      setCurrentImage((prev) =>
        prev === heroImages.length - 1
          ? 0
          : prev + 1
      )

    }, 3000)

    return () => clearInterval(interval)

  }, [heroImages.length])

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProducts = async () => {

    try {

      setLoading(true)
      setError('')

      const response = await API.get(
        `/api/products?search=${search || ''}&category=${category}&subcategory=${subcategory}&sort=${sort}&minPrice=${minPrice}&maxPrice=${maxPrice}`
      )

      console.log('Products API:', response.data)

      const data = response.data

      setProducts(
        Array.isArray(data)
          ? data
          : data.products || []
      )

    } catch (error) {

      console.log('Products Error:', error)

      setProducts([])
      setError('Failed to load products')

    } finally {

      setLoading(false)

    }
  }

  // =========================
  // FETCH CATEGORIES
  // =========================
  const fetchCategories = async () => {

    try {

      const response = await API.get('/api/categories')

      console.log('Categories API:', response.data)

      const data = response.data

    setCategories(
      Array.isArray(data)
        ? data
        : data.categories || data || []
    )

    } catch (error) {

      console.log('Categories Error:', error)

      setCategories([])

    }
  }

  // =========================
  // FETCH SUBCATEGORIES
  // =========================
  const fetchSubcategories = async () => {

    try {

      const response = await API.get('/api/subcategories')

      console.log('Subcategories API:', response.data)

      const data = response.data

      setSubcategories(
        Array.isArray(data)
          ? data
          : data.subcategories || []
      )

    } catch (error) {

      console.log('Subcategories Error:', error)

      setSubcategories([])

    }
  }

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {

    fetchCategories()
    fetchSubcategories()

  }, [])

  // =========================
  // FILTER PRODUCTS
  // =========================
  useEffect(() => {

    const delay = setTimeout(() => {
      fetchProducts()
    }, 400)

    return () => clearTimeout(delay)

  }, [
    search,
    category,
    subcategory,
    sort,
    minPrice,
    maxPrice,
  ])

  // =========================
  // CATEGORY CHANGE
  // =========================
  const handleCategory = (value) => {

    setCategory(value)
    setSubcategory('')

    if (!value) {
      setFilteredSubs([])
      return
    }

    const filtered = Array.isArray(subcategories)
      ? subcategories.filter(
          (sub) => sub.category?._id === value
        )
      : []

    setFilteredSubs(filtered)
  }

  // =========================
  // CLEAR FILTERS
  // =========================
  const clearFilters = () => {

    setCategory('')
    setSubcategory('')
    setSort('')
    setMinPrice('')
    setMaxPrice('')
    setFilteredSubs([])
  }

  return (

    <div className="min-h-screen bg-gray-100">

      {/* HERO SECTION */}
      <div className="bg-black text-white px-6 md:px-10 py-16">

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Discover Latest Fashion
            </h1>

            <p className="text-lg text-gray-300 mb-8 max-w-xl">
              Explore trending styles, premium collections,
              and the best products at unbeatable prices.
            </p>

            <div className="flex gap-4 flex-wrap">

              <button
                onClick={() => setShowFilters(true)}
                className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200"
              >
                Shop Now
              </button>

              {isLoggedIn && (
                <button
                  onClick={() => navigate('/orders')}
                  className="border border-white px-6 py-3 rounded-xl hover:bg-white hover:text-black transition"
                >
                  My Orders
                </button>
              )}

            </div>

          </div>

          {/* RIGHT */}
          <div className="relative">

            <img
              src={heroImages[currentImage]}
              alt="Fashion Banner"
              className="w-full h-[200px] md:h-[300px] object-cover rounded-3xl shadow-2xl transition-all duration-700"
            />

            <div className="absolute inset-0 bg-black/20 rounded-3xl"></div>

            {/* DOTS */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3">

              {Array.isArray(heroImages) &&
                heroImages.map((_, index) => (

                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-3 h-3 rounded-full transition ${
                      currentImage === index
                        ? 'bg-white scale-125'
                        : 'bg-gray-400'
                    }`}
                  />

                ))}

            </div>

          </div>

        </div>

      </div>

      {/* MAIN */}
      <div className="p-6 md:p-10 max-w-7xl mx-auto">

        {/* FILTER HEADER */}
        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl font-bold">
            Products
          </h2>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

        </div>

        {/* FILTERS */}
        {showFilters && (

          <div className="bg-white p-6 rounded-3xl shadow-lg mb-10 grid md:grid-cols-3 lg:grid-cols-6 gap-5">

            <select
              value={category}
              onChange={(e) => handleCategory(e.target.value)}
              className="border p-3 rounded-xl"
            >
              <option value="">Categories</option>

              {Array.isArray(categories) &&
                categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}

            </select>

            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="border p-3 rounded-xl"
            >
              <option value="">Subcategories</option>

              {Array.isArray(filteredSubs) &&
                filteredSubs.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}

            </select>

            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="border p-3 rounded-xl"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="border p-3 rounded-xl"
            />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border p-3 rounded-xl"
            >
              <option value="">Sort</option>

              <option value="low">
                Price Low to High
              </option>

              <option value="high">
                Price High to Low
              </option>

            </select>

            <button
              onClick={clearFilters}
              className="bg-red-500 text-white rounded-xl px-4 py-3 hover:bg-red-600"
            >
              Clear
            </button>

          </div>

        )}

        {/* ERROR */}
        {error && (
          <div className="text-center text-red-500 text-lg mb-6">
            {error}
          </div>
        )}

        {/* PRODUCTS */}
        {loading ? (

          <div className="text-center text-xl font-semibold py-20">
            Loading Products...
          </div>

        ) : !Array.isArray(products) || products.length === 0 ? (

          <div className="text-center text-gray-500 text-xl py-20">
            No products found
          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

            {products.map((product) => (

              <div
                key={product._id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-2"
              >

                <Link to={`/product/${product._id}`}>

                  <img
                                        src={
                      product.image
                        ? `https://ecommerce-iq9w.onrender.com/uploads/${product.image}`
                        : 'https://via.placeholder.com/300'
                    }
                    alt={product.name}
                    className="w-full h-[280px] object-cover"
                  />

                </Link>

                <div className="p-5">

                  <h2 className="text-2xl font-bold mb-2 line-clamp-1">
                    {product.name}
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">

                    <span className="text-2xl font-bold text-green-600">
                      ₹
                      {product.variants?.length > 0
                        ? Math.min(
                            ...product.variants.map(
                              (v) => v.price
                            )
                          )
                        : 0}
                    </span>

                    <button
                      onClick={() => {
                        console.log('View clicked product:', product)
                        console.log('product._id:', product?._id)

                        if (!product?._id) {
                          alert('Invalid product id')
                          return
                        }

                        navigate(`/product/${product._id}`)
                      }}
                      className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800"
                    >
                      View
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* WHATSAPP */}
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50"
      >

        <div className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition duration-300 hover:scale-110">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="w-8 h-8 fill-current"
          >
            <path d="M16 .396C7.164.396 0 7.56 0 16.396c0 3.11.893 6.02 2.438 8.49L0 32l7.337-2.385a15.93 15.93 0 0 0 8.663 2.537c8.836 0 16-7.164 16-16S24.836.396 16 .396z" />
          </svg>

        </div>

      </a>

    </div>
  )
}

export default Home