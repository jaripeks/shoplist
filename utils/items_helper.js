const Event = require('../models/event')

/**
 * Creates an Event document and saves it to mongo
 * @param {object} item - item to convert to DB event, format [{ name, quantity, list, date }], where list = listID and date can be null or completion date
 */
const convertToEvent = async items => {
	const events = items.map(item => {
		return ({
			item: item.item,
			quantity: item.quantity,
			date: item.date ? item.date : null,
			list: item.list
		})
	})
	const result = await Event.insertMany(events)
	return Object.values(result.map(event => event._id))
}

const convertToItems = async eventIDs => {
	const idReducer = (acc, current) => acc.concat(current)
	const list = eventIDs.reduce(idReducer, [])
	const events = await Event.find({ '_id': { $in: list } })

	const eventReducer = (items, event) => {
		// filter out all events that are not completed
		const newEvent = event.date === null
			? null
			: { date: event.date, quantity: event.quantity }

		const newItem = {
			item: event.item,
			events: newEvent === null ? [] : newEvent
		}

		// check if item found from items
		const foundItem = items.find(item => item.item === event.item)
		if (!foundItem) {
			// not found -> add
			return items.concat(newItem)
		}

		//found -> add the event under the item
		const events = foundItem.events.concat(newItem.events)
		const updatedItem = {
			...foundItem,
			events
		}
		// return item as is except the updatedItem
		return items.map(item => item.item !== newItem.item ? item : updatedItem)
	}

	const items = events.reduce(eventReducer, [{ item: events[0].item, events: [] }])
	return items
}

module.exports = {
	convertToEvent,
	convertToItems
}