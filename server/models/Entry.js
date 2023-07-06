import mongoose from "mongoose";

const entrySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        label: {
            type: String,
            required: true
        },
        month: {
            type: Number,
            required: true
        },
        day: {
            type: Number,
            required: true
        },
        year: {
            type: Number,
            required: true
        },
        content: { type: String },
    }, { timestamps : true } 
);

const Entry = mongoose.model('Entry', entrySchema)

export default Entry;