const Event = require('../models/event')

/**
 * Creates an Event document and saves it to mongo
 * @param {object} item - item to convert to DB event, format [{ name, quantity, list, date }], where list = listID and date can be null or completion date
 */
const convertToEvent = async items => {
	const events = items.map(item => {
		return({
			item: item.name,
			quantity: item.quantity,
			date: item.date ? item.date : null,
			list: item.list
		})
	})
	const result = await Event.insertMany(events)
	return Object.values(result.map(event => event._id))
}

module.exports = {
	convertToEvent
}