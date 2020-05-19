const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const List = require('../models/list')
const helper = require('./test_helper')
const baseUrl = '/api/lists'

/**
 * wraps app.js into a superagent-object (https://github.com/visionmedia/superagent)
 * enabling HTTP-requests while testing
 */
const api = supertest(app)

/**
 * initialize the test-collection:
 * 1. delete all items in the collection
 * 2. insert lists from test_helper.js
 */
beforeEach(async () => {
	await List.deleteMany({})
	await List.insertMany(helper.initialLists)
})

describe('smoketests', () => {
	test('lists are returned as json', async () => {
		await api
			.get(baseUrl)
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test(`DB has been initialized to have ${helper.initialLists.length} items`, async () => {
		const response = await api.get(baseUrl)
		expect(response.body).toHaveLength(helper.initialLists.length)
	})

	describe('list object fields', () => {
		test('have an id field and not an _id field', async () => {
			const response = await api.get(baseUrl)
			response.body.map(list => list.id).forEach(id => expect(id).toBeDefined())
			response.body.map(list => list._id).forEach(_id => expect(_id).not.toBeDefined())
		})

		test('have an items array field', async () => {
			const response = await api.get(baseUrl)
			response.body.map(list => list.items).forEach(items => expect(items).toBeDefined())
		})
	})
})

describe('POST method', () => {
	test('adds a list to the DB and responds with Created', async () => {
		const newList = {
			name: 'ostoslista'
		}
		await api
			.post(baseUrl)
			.send(newList)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const lists = await helper.listsInDb()
		expect(lists).toHaveLength(helper.initialLists.length + 1)

		const names = lists.map(list => list.name)
		expect(names).toContain('ostoslista')
	})

	test('does not add a list without name and responds with bad request', async () => {
		const newList = {
			default: true,
			active: true
		}
		await api
			.post(baseUrl)
			.send(newList)
			.expect(400)
	})
})

describe('GET method', () => {
	test('returns a specific resource', async () => {
		const lists = await helper.listsInDb()

		const list = await api
			.get(`${baseUrl}/${lists[0].id}`)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		expect(list.body.name).toEqual(lists[0].name)
	})

	test('responds with Not found if list is not found', async () => {
		await api
			.get(`${baseUrl}/${helper.nonId()}`)
			.expect(404)
	})
})

/**
 * close mongoose connection after tests
 */
afterAll(() => mongoose.connection.close())