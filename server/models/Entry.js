const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB: ', error.message)
    })

const entrySchema = new mongoose.Schema({
    content: String,
    date: Date,  
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

// customize the returned JSON object to remove sensitive information
entrySchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        // remove _id Object
        delete returnedObject._id
        // remove versionKey (__v) property
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Entry', entrySchema)