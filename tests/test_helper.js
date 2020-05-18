//const List = require('../models/list')

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

module.exports = {
	initialLists
}