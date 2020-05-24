const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
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

	//create a user to be able to test uniqueness
	const passwordHash = await bcrypt.hash('root', 10)
	const user = new User({ username: 'root', passwordHash })
	await user.save()
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
		expect(users).toHaveLength(2)
		expect(users.map(user => user.username)).toContain('admin')
	})
})

describe('user creation', () => {
	test('a non unique user create results in a proper error', async () => {
		const newUser = {
			username: 'root',
			password: 'root'
		}
		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)

		expect(result.body.error).toContain('`username` to be unique')
		const users = await helper.usersInDb()
		expect(users).toHaveLength(1)
	})

	test('too short pw results in a proper error', async () => {
		const newUser = {
			username: '2_shorty',
			password: 'ot'
		}
		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)

		expect(result.body.error).toContain('password must be atleast 3 characters')
		const users = await helper.usersInDb()
		expect(users).toHaveLength(1)
	})

	test('too short username results in a proper error', async () => {
		const newUser = {
			username: '2_',
			password: 'troot'
		}
		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)

		expect(result.body.error).toContain('User validation failed')
		const users = await helper.usersInDb()
		expect(users).toHaveLength(1)
	})
})

describe('login', () => {
	test('returns a bearer token', async () => {
		const response = await api
			.post('/api/login')
			.send({ username: 'root', password: 'root' })
			.expect(200)
			.expect('Content-Type', /application\/json/)

		expect(response.body.token).toBeDefined()
		expect(response.body.username).toBeDefined()
	})
})

/**
 * close mongoose connection after tests
 */
afterAll(() => mongoose.connection.close())