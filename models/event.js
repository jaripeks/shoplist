const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
	date: Date,
	item: String,
	quantity: Number,
	list: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'List'
	}
})

eventSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id,
		delete returnedObject._id
		returnedObject.name = returnedObject.item
		delete returnedObject.item
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Event', eventSchema)