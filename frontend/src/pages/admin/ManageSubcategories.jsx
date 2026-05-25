import {
  useEffect,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import API from '../../services/api'

import AdminSidebar
from '../../components/admin/AdminSidebar'

function ManageSubcategories() {

  const navigate =
    useNavigate()

  const [subcategories,
    setSubcategories] =
    useState([])

  const fetchSubcategories =
    async () => {

      const { data } =
        await API.get(
          '/subcategories'
        )

      setSubcategories(data)
    }

  useEffect(() => {

    fetchSubcategories()

  }, [])

  const deleteSubcategory =
    async (id) => {

      const confirmDelete =
        window.confirm(
          'Delete subcategory?'
        )

      if (!confirmDelete)
        return

      try {

        await API.delete(
          `/subcategories/${id}`
        )

        fetchSubcategories()

      } catch (error) {

        console.log(error)
      }
    }

  return (

    <div className='flex'>

      <AdminSidebar />

      <div className='flex-1 p-10 bg-gray-100 min-h-screen'>

        <div className='bg-white p-8 rounded-3xl shadow-xl'>

          <h1 className='text-4xl font-bold mb-8'>
            Manage Subcategories
          </h1>

          <div className='space-y-5'>

            {subcategories.map((sub) => (

              <div
                key={sub._id}
                className='border p-5 rounded-2xl flex items-center justify-between'
              >

                <div>

                  <h2 className='text-2xl font-bold'>
                    {sub.name}
                  </h2>

                  <p className='text-gray-500'>
                    {sub.category?.name}
                  </p>

                </div>

                <div className='flex gap-4'>

                  <button
                    onClick={() =>
                      navigate(
                        `/admin/edit-subcategory/${sub._id}`
                      )
                    }
                    className='bg-blue-600 text-white px-6 py-3 rounded-xl'
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteSubcategory(
                        sub._id
                      )
                    }
                    className='bg-red-600 text-white px-6 py-3 rounded-xl'
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  )
}

export default ManageSubcategories