/**
 * Module to help with tests
 */
const List = require('../models/list')
const Event = require('../models/event')
const User = require('../models/user')

/**
 * Events to insert into DB for tests
 */
const initialEvents = [
	{
		date: new Date(),
		items: 'Item1',
		quantity: 1
	},
	{
		date: new Date(),
		items: 'Item2',
		quantity: 2
	},
	{
		items: 'Item 3',
		quantity: 3
	},
	{
		items: 'Item neljä',
		quantity: 4
	},
]

/**
 * Lists to insert to DB for tests
 */
const initialLists = [
	{
		name: 'List1',
		created: new Date(),
		completed: new Date(),
		default: true,
		active: true
	},
	{
		name: 'List2',
		created: new Date(),
		completed: new Date(),
		default: true,
		active: false
	},
	{
		name: 'List3',
		created: new Date(),
		completed: new Date(),
		default: false,
		active: true
	},
	{
		name: 'List4',
		created: new Date(),
		completed: new Date(),
		default: false,
		active: false
	}
]

/**
 * Finds all list in DB formatted with the toJSON() function created for the schema.
 * Uses mongoose-functions, not HTTP calls
 */
const listsInDb = async () => {
	const lists = await List.find({})
	return lists.map(list => list.toJSON())
}

/**
 * Returns a list id that does not exist but is in correct format
 */
const nonId = async () => {
	const list = new List({ name: 'I rarely exist' })
	await list.save()
	await list.remove()
	return list._id.toString()
}

/**
 * Finds all events in DB formatted with the toJSON() function created for the schema.
 * Uses mongoose-functions, not HTTP calls
 */
const eventsInDb = async () => {
	const events = await Event.find({})
	return events.map(event => event.toJSON())
}

/**
 * Finds all users in DB formatted with the toJSON() function created for the schema.
 * Uses mongoose-functions, not HTTP calls
 */
const usersInDb = async () => {
	const users = await User.find({})
	return users.map(user => user.toJSON())
}

module.exports = {
	initialEvents,
	initialLists,
	listsInDb,
	nonId,
	eventsInDb,
	usersInDb
}