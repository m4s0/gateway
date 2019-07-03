'use strict'

const HttpProxy = require('fastify-http-proxy')

module.exports = async function (app, opts) {
    opts.tickets = opts.tickets || {}
    app.register(HttpProxy, {
        upstream: opts.tickets.url || process.env.TICKET_SERVICE
    })
}

module.exports.autoPrefix = '/tickets'
