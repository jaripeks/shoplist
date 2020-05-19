const List = require('../models/list')

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

module.exports = {
	initialLists,
	listsInDb,
	nonId
}