const mongoose = require('mongoose')
const validator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		minlength: 3,
		unique: true
	},
	passwordHash: String
})

userSchema.plugin(validator)

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.passwordHash
	}
})

module.exports = mongoose.model('User', userSchema)