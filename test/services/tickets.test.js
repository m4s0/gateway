'use strict'

const {test} = require('tap')
const {build,} = require('../helper')

test('create and get ticket', async (t) => {
    const app = build(t)

    const resCreate = await app.inject({
        method: 'POST',
        url: '/tickets',
        body: {
            title: 'ticket 1',
            body: 'text'
        }
    })
    t.equal(resCreate.statusCode, 201)

    const bodyCreate = JSON.parse(resCreate.body)
    t.ok(bodyCreate._id)
    const url = `/tickets/${bodyCreate._id}`
    t.equal(resCreate.headers.location, url)

    const resGet = await app.inject({
        method: 'GET',
        url
    })

    t.equal(resGet.statusCode, 200)
    t.deepEqual(JSON.parse(resGet.body), {
        _id: bodyCreate._id,
        title: 'ticket 1',
        body: 'text'
    })
})

test('create and get all', async (t) => {
    const app = build(t)

    const resCreate1 = await app.inject({
        method: 'POST',
        url: '/tickets',
        body: {
            title: 'ticket 1',
            body: 'text 1'
        }
    })
    const resCreate2 = await app.inject({
        method: 'POST',
        url: '/tickets',
        body: {
            title: 'ticket 2',
            body: 'text 2'
        }
    })
    t.equal(resCreate1.statusCode, 201)
    t.equal(resCreate2.statusCode, 201)

    const bodyCreate1 = JSON.parse(resCreate1.body)
    const bodyCreate2 = JSON.parse(resCreate2.body)

    t.ok(bodyCreate1._id)
    t.ok(bodyCreate2._id)

    const resGetAll = await app.inject({
        method: 'GET',
        url: '/tickets'
    })

    t.equal(resGetAll.statusCode, 200)

    t.deepEqual(JSON.parse(resGetAll.body), {
        tickets: [
            {
                _id: bodyCreate2._id,
                title: 'ticket 2',
                body: 'text 2'
            },
            {
                _id: bodyCreate1._id,
                title: 'ticket 1',
                body: 'text 1'
            }
        ]
    })
})

test('create fails', async (t) => {
    const app = build(t)

    const resCreate1 = await app.inject({
        method: 'POST',
        url: '/tickets',
        body: {
            body: 'text'
        }
    })
    t.equal(resCreate1.statusCode, 400)
    const bodyCreate1 = JSON.parse(resCreate1.body)
    t.equal(bodyCreate1.message, "body should have required property 'title'")

    const resCreate2 = await app.inject({
        method: 'POST',
        url: '/tickets',
        body: {
            title: 'title'
        }
    })
    t.equal(resCreate2.statusCode, 400)
    const bodyCreate2 = JSON.parse(resCreate2.body)
    t.equal(bodyCreate2.message, "body should have required property 'body'")
})
