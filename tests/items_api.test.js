const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')
const List = require('../models/list')
const helper = require('./test_helper')
const baseUrl = '/api/items'

/**
 * wraps app.js into a superagent-object (https://github.com/visionmedia/superagent)
 * enabling HTTP-requests while testing
 */
const api = supertest(app)

beforeEach(async () => {
	await User.deleteMany({})
	const passwordHash = await bcrypt.hash('root', 10)
	const user = new User({ username: 'root', passwordHash })
	await user.save()
	const testUser = await helper.usersInDb()

	const token = await login()

	const items = helper.initialItems

	await List.deleteMany({})

	const lists = helper.initialLists

	const list = {
		...lists[0],
		items,
		user: testUser[0].id
	}

	await api
		.post('/api/lists')
		.set('Authorization', token)
		.send(list)
})

describe('smoketest', () => {
	test('items are returned as json', async () => {
		const token = await login()
		await api
			.get(baseUrl)
			.set('Authorization', token)
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test(`initial ${helper.initialItems.length} items are returned`, async () => {
		const token = await login()
		const result = await api
			.get(baseUrl)
			.set('Authorization', token)
			.expect(200)
			.expect('Content-Type', /application\/json/)
		expect(result.body).toHaveLength(helper.initialItems.length)
		expect(result.body.map(item => item.item)).toContain('Tuote3')
		result.body.map(item => item.events).forEach(events => expect(events).toHaveLength(0))
	})
})

const login = async () => {
	const loginResponse = await api
		.post('/api/login')
		.send({ username: 'root', password: 'root' })
	const token = `bearer ${loginResponse.body.token}`
	return token
}

/**
 * close mongoose connection after tests
 */
afterAll(() => mongoose.connection.close())