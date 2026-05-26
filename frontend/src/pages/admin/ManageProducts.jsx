import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../services/api'
import AdminSidebar from '../../components/admin/AdminSidebar'

function ManageProducts() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])

  const fetchProducts = async () => {
    try {
const { data } = await API.get('/api/products')
      setProducts(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const deleteProduct = async (id) => {
    const ok = window.confirm('Delete product?')
    if (!ok) return

    try {
await API.delete(`/api/products/${id}`)
      fetchProducts()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 p-10 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold mb-8">
          Manage Products
        </h1>

        <div className="space-y-5">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white p-5 rounded-2xl flex items-center justify-between gap-6"
            >
              {/* LEFT SIDE */}
              <div className="flex items-center gap-4">
                
                {/* PRODUCT IMAGE */}
                <img
src={`${import.meta.env.VITE_API_UPLOADS_URL}/${product.image}`}
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover border"
                />

                <div>
                  <h2 className="text-xl font-bold">
                    {product.name}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-4">
                <button
                  onClick={() =>
                    navigate(`/admin/edit-product/${product._id}`)
                  }
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteProduct(product._id)}
                  className="bg-red-600 text-white px-5 py-2 rounded-xl"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ManageProducts