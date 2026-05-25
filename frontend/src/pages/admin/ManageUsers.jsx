import {
  useEffect,
  useState,
} from 'react'

import API from '../../services/api'

import AdminSidebar
from '../../components/admin/AdminSidebar'

function ManageUsers() {

  const [users,
    setUsers] =
    useState([])

  const [search,
    setSearch] =
    useState('')


  const fetchUsers =
    async () => {

      try {

        const { data } =
          await API.get(
            '/auth'
          )

        setUsers(data)

      } catch (error) {

        console.log(error)
      }
    }

  useEffect(() => {

    fetchUsers()

  }, [])


  const deleteUser =
    async (id) => {

      const confirmDelete =
        window.confirm(
          'Delete User?'
        )

      if (!confirmDelete)
        return

      try {

        await API.delete(
          `/auth/${id}`
        )

        fetchUsers()

      } catch (error) {

        console.log(error)
      }
    }


  const toggleBlock =
    async (id) => {

      try {

        await API.put(
          `/auth/block/${id}`
        )

        fetchUsers()

      } catch (error) {

        console.log(error)
      }
    }


  const filteredUsers =
    users.filter((user) =>

      user.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    )

  return (

    <div className='flex'>

      <AdminSidebar />

      <div className='flex-1 p-10 bg-gray-100 min-h-screen'>

        <div className='flex items-center justify-between mb-10'>

          <h1 className='text-5xl font-bold'>
            Manage Users
          </h1>

          <input
            type='text'
            placeholder='Search User'
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className='border p-4 rounded-xl w-[300px]'
          />

        </div>

        <div className='space-y-6'>

          {filteredUsers.map((user) => (

            <div
              key={user._id}
              className='bg-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-5'
            >

              <div>

                <h2 className='text-2xl font-bold'>
                  {user.name}
                </h2>

                <p className='text-gray-500'>
                  {user.email}
                </p>

                <div className='flex gap-3 mt-3'>

                  <span className='bg-black text-white px-4 py-1 rounded-full text-sm'>
                    {user.role}
                  </span>

                  <span
                    className={`px-4 py-1 rounded-full text-sm text-white
                    ${
                      user.isBlocked
                        ? 'bg-red-600'
                        : 'bg-green-600'
                    }`}
                  >

                    {user.isBlocked
                      ? 'Blocked'
                      : 'Active'}

                  </span>

                </div>

              </div>

              {user.role !==
                'admin' && (

                <div className='flex gap-4'>

                  <button
                    onClick={() =>
                      toggleBlock(
                        user._id
                      )
                    }
                    className='bg-yellow-500 text-white px-6 py-3 rounded-2xl'
                  >

                    {user.isBlocked
                      ? 'Unblock'
                      : 'Block'}

                  </button>

                  <button
                    onClick={() =>
                      deleteUser(
                        user._id
                      )
                    }
                    className='bg-red-600 text-white px-6 py-3 rounded-2xl'
                  >
                    Delete
                  </button>

                </div>

              )}

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}

export default ManageUsers