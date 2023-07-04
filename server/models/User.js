import mongoose from "mongoose";

const numRecentEntries = 31;

const userSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true,
        max: 50
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    entries: {    
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Entry'
        }],
        validate : [isNumEntriesBounded, '{PATH} exceeds the limit of {numRecentEntries}']
    }
});

function isNumEntriesBounded(val) {
    return val.length <= numRecentEntries;
}

const User = mongoose.model('User', userSchema)
export default User;