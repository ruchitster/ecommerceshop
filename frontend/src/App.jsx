// App.jsx

import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

import Home from './pages/Home'
import Auth from './pages/Auth'
import Cart from './pages/Cart'

import Dashboard from './pages/admin/Dashboard'
import AddProduct from './pages/admin/AddProduct'
import EditProduct from './pages/admin/EditProduct'
import ManageProducts from './pages/admin/ManageProducts'   // ✅ ADDED

import AdminRoute from './routes/AdminRoute'

import AddCategory from './pages/admin/AddCategory'
import ManageCategories from './pages/admin/ManageCategories'
import EditCategory from './pages/admin/EditCategory'

import AddSubcategory from './pages/admin/AddSubcategory'
import ManageSubcategories from './pages/admin/ManageSubcategories'
import EditSubcategory from './pages/admin/EditSubcategory'

import ManageOrders from './pages/admin/ManageOrders'
import ManageUsers from './pages/admin/ManageUsers'
import OrderDetails from './pages/OrderDetails'

import ProductDetails from './pages/ProductDetails'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Contact from './pages/Contact'

import AdminLogin from './pages/admin/AdminLogin'

function App() {

  const [search, setSearch] = useState('')

  return (
    <div>

      {/* NAVBAR */}
      <Navbar
        search={search}
        setSearch={setSearch}
      />

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route
          path='/'
          element={
            <Home
              search={search}
              setSearch={setSearch}
            />
          }
        />

        <Route path='/login' element={<Auth />} />
        <Route path='/register' element={<Auth />} />
        <Route path='/admin/login' element={<AdminLogin />} />

        <Route path='/product/:id' element={<ProductDetails />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/orders/:id' element={<OrderDetails />} />
        <Route path='/contact' element={<Contact />} />

        {/* ADMIN ROUTES */}
        <Route
          path='/admin/dashboard'
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />

        {/* PRODUCTS */}
        <Route
          path='/admin/add-product'
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />

        <Route
          path='/admin/manage-products'
          element={
            <AdminRoute>
              <ManageProducts />
            </AdminRoute>
          }
        />

        <Route
          path='/admin/edit-product/:id'
          element={
            <AdminRoute>
              <EditProduct />
            </AdminRoute>
          }
        />

        {/* CATEGORIES */}
        <Route
          path='/admin/add-category'
          element={
            <AdminRoute>
              <AddCategory />
            </AdminRoute>
          }
        />

        <Route
          path='/admin/manage-categories'
          element={
            <AdminRoute>
              <ManageCategories />
            </AdminRoute>
          }
        />

        <Route
          path='/admin/edit-category/:id'
          element={
            <AdminRoute>
              <EditCategory />
            </AdminRoute>
          }
        />

        {/* SUBCATEGORIES */}
        <Route
          path='/admin/add-subcategory'
          element={
            <AdminRoute>
              <AddSubcategory />
            </AdminRoute>
          }
        />

        <Route
          path='/admin/manage-subcategories'
          element={
            <AdminRoute>
              <ManageSubcategories />
            </AdminRoute>
          }
        />

        <Route
          path='/admin/edit-subcategory/:id'
          element={
            <AdminRoute>
              <EditSubcategory />
            </AdminRoute>
          }
        />

        {/* ORDERS & USERS */}
        <Route
          path='/admin/orders'
          element={
            <AdminRoute>
              <ManageOrders />
            </AdminRoute>
          }
        />

        <Route
          path='/admin/users'
          element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          }
        />

      </Routes>

      {/* FOOTER */}
      <Footer />

    </div>
  )
}

export default App