import { pipeline } from "@xenova/transformers"
import User from "../models/User.js";
import Entry from "../models/Entry.js";

class SentimentAnalysisPipeline {
    static task = "text-classification"
    static model = "Xenova/bert-base-multilingual-uncased-sentiment"
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance == null) {
            this.instance = pipeline(this.task, this.model, { progress_callback });
        }

        return this.instance;
    }
}

export const analyzeSentiment = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        const mostRecentPosts = user.toObject().entries
        
        console.log('most recent posts')

        const classifier = await SentimentAnalysisPipeline.getInstance()
        var data = []
        for (let i = 0; i < mostRecentPosts.length; i++) {
            let post = await Entry.findById(mostRecentPosts[i]);
            // dates.push(post.createdAt);
            let text = post.label;
            console.log(text);
            // cached classifier returns JSON array of size 1 containing the most probable sentiment
            let response = await classifier(text);
            console.log(response);
            let { label } = response[0];
            let sentiment = Number(label.slice(0, 1)); 
            // responses.push(sentiment); 
            let date = new Date(post.year, post.month, post.day)
            console.log(`${date}`)
            console.log(sentiment)
            data.push({ date: date,  rank: sentiment , label: post.label });
        }
        console.log(`data ${data}`)
        res.status(200).json(data)
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}