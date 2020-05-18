const supertest = require('supertest')
const app = require('../app')
const baseUrl = '/api/items'

/**
 * wraps app.js into a superagent-object (https://github.com/visionmedia/superagent)
 * enabling HTTP-requests while testing
 */
const api = supertest(app)

/**
 * initialize the test-collection
 */
beforeEach(async () => {

})

describe('smoketests', () => {
	test('items are returned as json', async () => {
		await api
			.get(baseUrl)
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('DB has been initialized to have items', async () => {
		const response = await api.get(baseUrl)
		expect(response.body).toHaveLength(1)
	})
})