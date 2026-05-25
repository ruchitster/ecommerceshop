const { api, authHeader } = require('./helpers/apiHelper.js')

describe('API Auth (scaffold)', () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret'
  })

  afterAll(async () => {
    // Intentionally left blank. Add cleanup when DB test isolation is implemented.
  })

  it('API helper is chainable (scaffold sanity)', async () => {
    const res = await api().post('/api/auth/register').set(authHeader('t')).send({})
    // Scaffold returns 501 until real Supertest app wiring exists.
    expect(res.status).toBe(501)
  })
})


