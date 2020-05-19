const List = require('../models/list')
const Event = require('../models/event')

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

const listsInDb = async () => {
	const lists = await List.find({})
	return lists.map(list => list.toJSON())
}

const nonId = async () => {
	const list = new List({ name: 'I rarely exist' })
	await list.save()
	await list.remove()
	return list._id.toString()
}

const eventsInDb = async () => {
	const events = await Event.find({})
	return events.map(event => event.toJSON())
}

module.exports = {
	initialEvents,
	initialLists,
	listsInDb,
	nonId,
	eventsInDb
}