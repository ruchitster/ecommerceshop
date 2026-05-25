import { Link, useNavigate } from 'react-router-dom'

function Navbar({ search, setSearch }) {

  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const isLoggedIn = Boolean(token)

  const user =
    JSON.parse(localStorage.getItem('user'))

  const isAdmin =
    user?.role === 'admin'

  const handleLogout = () => {

    localStorage.removeItem('token')
    localStorage.removeItem('user')

    navigate('/')
  }

  return (

    <nav className='bg-black text-white px-4 md:px-6 py-4 flex items-center justify-between gap-4 flex-wrap'>

      {/* LOGO */}
      <Link
        to='/'
        className='text-2xl font-bold whitespace-nowrap'
      >
        ShopSphere
      </Link>

      {/* SEARCH BAR */}
      <div className='flex-1 w-full md:w-auto md:flex md:justify-center'>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            bg-white
            text-black
            placeholder-gray-500
            px-4
            py-2
            rounded-xl
            outline-none
            w-full
            md:w-[320px]
            focus:ring-2
            focus:ring-white
          "
        />

      </div>

      {/* NAV LINKS */}
      <div className='flex items-center gap-5 whitespace-nowrap flex-wrap'>

        <Link
          to='/'
          className='hover:text-gray-300 transition'
        >
          Home
        </Link>

        {!isAdmin && (
  <Link
    to='/cart'
    className='hover:text-gray-300 transition'
  >
    Cart
  </Link>
)}

        <Link
          to='/contact'
          className='hover:text-gray-300 transition'
        >
          Contact
        </Link>

        {/* ADMIN PANEL */}
        {isAdmin && (

          <Link
            to='/admin/dashboard'
            className='text-yellow-400 hover:text-yellow-300 transition font-semibold'
          >
            Admin
          </Link>

        )}

        {!isLoggedIn ? (

          <>
          
            <Link
              to='/login'
              className='hover:text-gray-300 transition'
            >
              Login
            </Link>

          </>

        ) : (

          <button
            type='button'
            onClick={handleLogout}
            className='hover:text-gray-300 transition'
          >
            Logout
          </button>

        )}

      </div>

    </nav>
  )
}

export default Navbar