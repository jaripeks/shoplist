const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

/**
 * wraps app.js into a superagent-object (https://github.com/visionmedia/superagent)
 * enabling HTTP-requests while testing
 */
const api = supertest(app)

beforeEach(async () => {
	await User.deleteMany({})
})

/**
 * tests that ensure there is any point in doing rest of the tests
 */
describe('smoketests', () => {
	test('a new user can be created', async () => {
		const response = await api
			.post('/api/users')
			.send({ username: 'admin', password: '1234' })
			.expect(201)
			.expect('Content-Type', /application\/json/)

		expect(response.body.username).toEqual('admin')

		const users = await helper.usersInDb()
		expect(users).toHaveLength(1)
	})
})

/**
 * close mongoose connection after tests
 */
afterAll(() => mongoose.connection.close())