'use strict'

module.exports = async function (fastify, opts) {
    const tickets = fastify.mongo.db.collection('tickets')
    const {ObjectId} = fastify.mongo

    const schema = {
        body: {
            type: 'object',
            required: ['title', 'body'],
            properties: {
                title: {type: 'string'},
                body: {type: 'string'}
            }
        }
    }

    fastify.post('/', {schema}, async function (request, reply) {
        const data = await tickets.insertOne(request.body)

        const _id = data.ops[0]._id

        reply
            .code(201)
            .header('location', `${this.prefix}/${_id}`)

        return Object.assign({
            _id
        }, request.body)
    })

    fastify.get('/', async function (request, reply) {
        const array = await tickets.find().sort({
            _id: -1
        }).toArray()

        return {tickets: array}
    })

    fastify.get('/:id', async function (request, reply) {
        const id = request.params.id

        const data = await tickets.findOne({
            _id: new ObjectId(id)
        })

        if (!data) {
            reply.code(404)
            return {status: 'not ok'}
        }

        return data
    })
}

module.exports.autoPrefix = '/tickets'
