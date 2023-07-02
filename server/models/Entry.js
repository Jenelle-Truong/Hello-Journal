import mongoose from "mongoose";

const entrySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: String,
    }, { timestamps : true } 
);

const Entry = mongoose.model('Entry', entrySchema)

export default Entry;