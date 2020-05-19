const mongoose = require('mongoose')

const listSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	created: Date,
	completed: Date,
	default: Boolean,
	active: Boolean,
	items: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Event'
		}
	]
})

listSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id,
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('List', listSchema)