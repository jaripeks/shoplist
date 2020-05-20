const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const List = require('../models/list')
const Event = require('../models/event')
const helper = require('./test_helper')
const baseUrl = '/api/lists'

/**
 * wraps app.js into a superagent-object (https://github.com/visionmedia/superagent)
 * enabling HTTP-requests while testing
 */
const api = supertest(app)

/**
 * initialize the test-collection:
 * 1. delete all events in the test collection
 * 2. insert events from test_helper.js to test collection
 * 3. delete all items in the test collection
 * 4. generate lists by combining lists from test_helper.js and events
 * 5. insert generated lists to test collection
 */
beforeEach(async () => {
	await Event.deleteMany({})
	await Event.insertMany(helper.initialEvents)

	const events = await helper.eventsInDb()

	await List.deleteMany({})

	const lists = helper.initialLists.map((list, index) => {
		return (
			{
				...list,
				event: events[index]
			}
		)
	})

	await List.insertMany(lists)
})

/**
 * tests that ensure there is any point in doing rest of the tests
 */
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
		const listsAtStart = await helper.listsInDb()

		const newList = {
			default: true,
			active: true
		}
		await api
			.post(baseUrl)
			.send(newList)
			.expect(400)

		const listsAtEnd = await helper.listsInDb()
		expect(listsAtEnd).toHaveLength(listsAtStart.length)
	})
})

/**
 * does not test the GET collectionURI, since it is tested in the smoketests
 * and used throughout the rest of the tests
 */
describe('GET method', () => {
	test('returns a specific resource', async () => {
		const lists = await helper.listsInDb()

		const list = await api
			.get(`${baseUrl}/${lists[0].id}`)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		expect(list.body.name).toEqual(lists[0].name)
	})
})

describe('PUT method', () => {
	test('updates the list', async () => {
		const listsAtStart = await helper.listsInDb()

		const updatedList = {
			...listsAtStart[0],
			default: false,
			active: false
		}

		await api
			.put(`${baseUrl}/${listsAtStart[0].id}`)
			.send(updatedList)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		const listsAtEnd = await helper.listsInDb()
		expect(listsAtEnd).toHaveLength(listsAtStart.length)
		expect(listsAtEnd.find(list => list.id.toString() === updatedList.id.toString()).active).toBeFalsy()
	})
})

describe('DELETE method', () => {
	test('deletes a specific list', async () => {
		const listsAtStart = await helper.listsInDb()
		const list = listsAtStart[0]

		await api
			.delete(`${baseUrl}/${list.id}`)
			.expect(204)

		const listsAtEnd = await helper.listsInDb()
		expect(listsAtEnd).toHaveLength(listsAtStart.length - 1)
		expect(listsAtEnd.map(list => list.name)).not.toContain(list.name)
	})
})

/**
 * close mongoose connection after tests
 */
afterAll(() => mongoose.connection.close())