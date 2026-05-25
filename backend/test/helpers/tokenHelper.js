const jwt = require('jsonwebtoken')

const User = require('../../models/User.js')

async function createUserAndToken({
  email,
  password,
  name = 'Test User',
  role = 'user',
} = {}) {
  const user = await User.create({
    name,
    email,
    password,
    role,
  })

  const token = jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET || 'test_jwt_secret',
    { expiresIn: '1h' }
  )

  return { user, token }
}

module.exports = { createUserAndToken }


