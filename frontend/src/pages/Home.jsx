import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../services/api'

function Home({ search }) {

  const navigate = useNavigate()

  // STATES
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

  const heroImages = [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b',
  ]

  const [currentImage, setCurrentImage] = useState(0)

  // AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  // HERO ROTATION
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === heroImages.length - 1 ? 0 : prev + 1
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [heroImages.length])

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await API.get(
        `/products?search=${search || ''}&category=${category}&subcategory=${subcategory}&sort=${sort}&minPrice=${minPrice}&maxPrice=${maxPrice}`
      )

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

  // FETCH CATEGORIES
  const fetchCategories = async () => {
    try {
      const response = await API.get('/categories')

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

  // FETCH SUBCATEGORIES
  const fetchSubcategories = async () => {
    try {
      const response = await API.get('/subcategories')

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

  // INITIAL LOAD
  useEffect(() => {
    fetchCategories()
    fetchSubcategories()
  }, [])

  // FILTER PRODUCTS
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts()
    }, 400)

    return () => clearTimeout(delay)
  }, [search, category, subcategory, sort, minPrice, maxPrice])

  // CATEGORY CHANGE
  const handleCategory = (value) => {
    setCategory(value)
    setSubcategory('')

    if (!value) {
      setFilteredSubs([])
      return
    }

    const filtered = Array.isArray(subcategories)
      ? subcategories.filter((sub) => sub.category?._id === value)
      : []

    setFilteredSubs(filtered)
  }

  // CLEAR FILTERS
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

      {/* HERO */}
      <div className="bg-black text-white px-6 md:px-10 py-16">

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Discover Latest Fashion
            </h1>

            <p className="text-lg text-gray-300 mb-8 max-w-xl">
              Explore trending styles, premium collections and best deals.
            </p>

            <div className="flex gap-4 flex-wrap">

              <button
                onClick={() => setShowFilters(true)}
                className="bg-white text-black px-6 py-3 rounded-xl font-semibold"
              >
                Shop Now
              </button>

              {isLoggedIn && (
                <button
                  onClick={() => navigate('/orders')}
                  className="border border-white px-6 py-3 rounded-xl"
                >
                  My Orders
                </button>
              )}

            </div>
          </div>

          <div className="relative">

            <img
              src={heroImages[currentImage]}
              className="w-full h-[250px] object-cover rounded-3xl"
            />

          </div>

        </div>
      </div>

      {/* FILTERS */}
      {showFilters && (
        <div className="p-6 bg-white shadow-md grid md:grid-cols-3 gap-4">

          <select value={category} onChange={(e) => handleCategory(e.target.value)}>
            <option value="">Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
            <option value="">Subcategories</option>
            {filteredSubs.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>

          <input type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Sort</option>
            <option value="low">Low to High</option>
            <option value="high">High to Low</option>
          </select>

          <button onClick={clearFilters}>Clear</button>

        </div>
      )}

      {/* PRODUCTS */}
      <div className="p-6 grid md:grid-cols-4 gap-6">

        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No products found</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="bg-white p-4 rounded-xl">

              <Link to={`/product/${product._id}`}>
                <img
                  src={
                    product.image
                      ? `https://ecommerce-iq9w.onrender.com/uploads/${product.image}`
                      : 'https://via.placeholder.com/300'
                  }
                  className="w-full h-48 object-cover"
                />
              </Link>

              <h2>{product.name}</h2>

              <button
                onClick={() => navigate(`/product/${product._id}`)}
              >
                View
              </button>

            </div>
          ))
        )}

      </div>

    </div>
  )
}

export default Home