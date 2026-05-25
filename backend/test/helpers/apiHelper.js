const request = require('supertest')

let app
async function getApp() {
  if (app) return app
  const mod = await import('../../server.js')
  // server.js doesn't export app; it starts listening.
  // Return a minimal express instance fallback.
  app = mod.default
  return app
}

function api() {
  // Scaffold: simple chainable stub to let Jest execute.
  // TODO: Export Express app from backend/server.js and use supertest properly.
  const chain = {
    post: () => chain,
    get: () => chain,
    put: () => chain,
    delete: () => chain,
    set: () => chain,
    send: async () => ({ status: 501, body: {} }),
  }

  return chain
}




function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

module.exports = { api, authHeader }


