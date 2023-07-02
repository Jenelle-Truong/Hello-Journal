import Entry from "../models/Entry.js";
import User from "../models/User.js";

const numRecentEntries = 31;

// Create
export const createEntry = async (req, res) => {
    try {
        const { userId, content } = req.body;
        const user = await User.findById(userId);
        const newEntry = new Entry({
            user,
            content
        })
        await newEntry.save();

        // updates the embedded collection of the user's most recent posts
        await user.updateOne(
            {
                $push: {
                    entries: {
                        $each: [newEntry],
                        $slice: -1 * numRecentEntries
                    } 
                }
            }
        )

        // return most recent posts
        const mostRecentPosts = await User.findById().entries;
        res.status(201).json(mostRecentPosts);

    } catch (err) {
        res.status(409).json({ message: err.message })
    }
}

// Read
export const getUserEntries = async (req, res) => {
    try {
        const { userId } = req.body;
        const entries = await Entry.find({ userId });
        res.status(200).json(entries);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

// Update
export const updateEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const { updatedContent } = req.body;
        const updatedEntry = await Entry.findByIdAndUpdate(
            id, 
            { content: updatedContent }
        );
        res.status(200).json(updatedEntry);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}