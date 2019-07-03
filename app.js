'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')
const proxy = require('fastify-http-proxy')

module.exports = function (fastify, opts, next) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in services
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
    options: Object.assign({}, opts)
  })

  fastify.register(proxy, {
    upstream: 'http://127.0.0.1:3001',
    prefix: '/tickets', // optional
    http2: false // optional
  })

  // Make sure to call next when done
  next()
}
