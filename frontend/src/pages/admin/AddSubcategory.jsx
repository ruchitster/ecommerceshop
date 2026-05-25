import {
  useEffect,
  useState,
} from 'react'

import API from '../../services/api'

import AdminSidebar
from '../../components/admin/AdminSidebar'

function AddSubcategory() {

  const [name, setName] =
    useState('')

  const [categories,
    setCategories] = useState([])

  const [category,
    setCategory] = useState('')

  useEffect(() => {

    fetchCategories()

  }, [])

  const fetchCategories =
    async () => {

      try {

        const { data } =
          await API.get('/categories')

        setCategories(data)

      } catch (error) {

        console.log(error)
      }
    }

  const handleSubmit =
    async (e) => {

      e.preventDefault()

      try {

        await API.post(
          '/subcategories',
          {
            name,
            category,
          }
        )

        alert(
          'Subcategory Added'
        )

      } catch (error) {

        console.log(error)
      }
    }

  return (

    <div className='flex'>

      <AdminSidebar />

      <div className='flex-1 p-10 bg-gray-100 min-h-screen'>

        <div className='bg-white p-8 rounded-3xl shadow max-w-[700px]'>

          <h1 className='text-4xl font-bold mb-8'>
            Add Subcategory
          </h1>

          <form onSubmit={handleSubmit}>

            <input
              type='text'
              placeholder='Subcategory Name'
              className='w-full border p-4 rounded-xl mb-5'
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

            <select
              className='w-full border p-4 rounded-xl mb-5'
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >

              <option>
                Select Category
              </option>

              {categories.map((cat) => (

                <option
                  key={cat._id}
                  value={cat._id}
                >
                  {cat.name}
                </option>

              ))}

            </select>

            <button
              type='submit'
              className='bg-black text-white px-8 py-3 rounded-xl'
            >
              Add Subcategory
            </button>

          </form>

        </div>

      </div>

    </div>
  )
}

export default AddSubcategory