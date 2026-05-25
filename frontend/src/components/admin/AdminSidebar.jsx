import {
  Link,
  useLocation,
} from 'react-router-dom'

import {
  useState,
} from 'react'

function AdminSidebar() {

  const location = useLocation()

  const [showProducts, setShowProducts] =
    useState(false)

  const [showCategories, setShowCategories] =
    useState(false)

  const [showSubcategories, setShowSubcategories] =
    useState(false)

  const linkClass = (path) =>
    `p-3 rounded-xl duration-200 ${
      location.pathname === path
        ? 'bg-gray-800'
        : 'hover:bg-gray-800'
    }`

  return (

    <div className="w-[250px] min-h-screen bg-black text-white p-6">

      <h1 className="text-3xl font-bold mb-10">
        Admin Panel
      </h1>

      <div className="flex flex-col gap-3 text-lg">

        {/* DASHBOARD */}
        <Link
          to="/admin/dashboard"
          className={linkClass('/admin/dashboard')}
        >
          Dashboard
        </Link>

        {/* PRODUCTS DROPDOWN */}
        <div>

          <button
            onClick={() =>
              setShowProducts(!showProducts)
            }
            className="w-full flex items-center justify-between hover:bg-gray-800 p-3 rounded-xl duration-200"
          >
            <span>Products</span>

            <span>
              {showProducts ? '−' : '+'}
            </span>
          </button>

          {showProducts && (

            <div className="ml-4 mt-2 flex flex-col gap-2">

              <Link
                to="/admin/add-product"
                className={linkClass('/admin/add-product')}
              >
                Add Product
              </Link>

              <Link
  to="/admin/manage-products"
  className={linkClass('/admin/manage-products')}
>
  Manage Products
</Link>

            </div>

          )}

        </div>

        {/* CATEGORIES DROPDOWN */}
        <div>

          <button
            onClick={() =>
              setShowCategories(!showCategories)
            }
            className="w-full flex items-center justify-between hover:bg-gray-800 p-3 rounded-xl duration-200"
          >
            <span>Categories</span>

            <span>
              {showCategories ? '−' : '+'}
            </span>
          </button>

          {showCategories && (

            <div className="ml-4 mt-2 flex flex-col gap-2">

              <Link
                to="/admin/add-category"
                className={linkClass('/admin/add-category')}
              >
                Add Category
              </Link>

              <Link
                to="/admin/manage-categories"
                className={linkClass('/admin/manage-categories')}
              >
                Manage Categories
              </Link>

            </div>

          )}

        </div>

        {/* SUBCATEGORIES DROPDOWN */}
        <div>

          <button
            onClick={() =>
              setShowSubcategories(!showSubcategories)
            }
            className="w-full flex items-center justify-between hover:bg-gray-800 p-3 rounded-xl duration-200"
          >
            <span>Subcategories</span>

            <span>
              {showSubcategories ? '−' : '+'}
            </span>
          </button>

          {showSubcategories && (

            <div className="ml-4 mt-2 flex flex-col gap-2">

              <Link
                to="/admin/add-subcategory"
                className={linkClass('/admin/add-subcategory')}
              >
                Add Subcategory
              </Link>

              <Link
                to="/admin/manage-subcategories"
                className={linkClass('/admin/manage-subcategories')}
              >
                Manage Subcategories
              </Link>

            </div>

          )}

        </div>

        {/* ORDERS */}
        <Link
          to="/admin/orders"
          className={linkClass('/admin/orders')}
        >
          Manage Orders
        </Link>

        {/* USERS */}
        <Link
          to="/admin/users"
          className={linkClass('/admin/users')}
        >
          Manage Users
        </Link>

      </div>

    </div>
  )
}

export default AdminSidebar