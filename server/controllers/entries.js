import Entry from "../models/Entry.js";
import User from "../models/User.js";

const numRecentEntries = 31;

// Create
export const createEntry = async (req, res) => {
    try {
        console.log(req.body)
        const { userId, dayLabel, month, day, year, content } = req.body;
        console.log(userId)
        const user = await User.findById(userId);
        const newEntry = new Entry({
            userId,
            label: dayLabel, 
            month, 
            day, 
            year,
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
        const mostRecentPosts = await User.findById(userId);
        console.log(mostRecentPosts)
        console.log(mostRecentPosts.toObject().entries)
        res.status(201).json(mostRecentPosts);

    } catch (err) {
        res.status(409).json({ message: err.message })
    }
}

// Read
export const getSpecificEntry = async (req, res) => {
    try {
        const { userId, month, day, year } = req.params;
        const entry = await Entry.find({ userId, month, day, year });
        console.log("here")
        console.log(entry[0]);
        if (entry.length === 0) {
            res.status(404).json({ message: "no entries found" })
        } else {
            res.status(200).json(entry[0])
        };
    } catch (err) {
        res.status(404).json({ message: err.messaage })
    }
}

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
        const { label, content } = req.body;
        const updatedEntry = await Entry.findByIdAndUpdate(
            id, 
            { 
                label,
                content
            }
        );
        res.status(200).json(updatedEntry);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}