'use strict'

const HttpProxy = require('fastify-http-proxy')

module.exports = async function (app, opts) {
    opts.auth = opts.auth || {}
    app.register(HttpProxy, {
        upstream: opts.auth.url || process.env.AUTH_SERVICE
    })
}

module.exports.autoPrefix = '/users'
