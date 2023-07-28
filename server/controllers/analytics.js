import User from "../models/User.js";
import Entry from "../models/Entry.js";

export const analyzeSentiment = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        const mostRecentPosts = user.toObject().entries

        var data = []
        for (let i = 0; i < mostRecentPosts.length; i++) {
            let post = await Entry.findById(mostRecentPosts[i]);
            let text = post.label;
            let response = await fetch(
                "https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment",
                {
                    method: "POST", 
                    headers: { Authorization: `Bearer ${process.env.HF_TOKEN}`},
                    body: JSON.stringify(text)
                }
            )
            let responseData = await response.json();
            let maxScore = 0;
            let sentiment = "";
            for (let j = 0; j < responseData[0].length; j++) {
                let { label, score } = responseData[0][j];
                if (score > maxScore) {
                    maxScore = score
                    sentiment = Number(label.slice(0, 1));
                }
            }
            let date = new Date(post.year, post.month, post.day)
            data.push({ date: date,  rank: sentiment , label: post.label });
        }
        res.status(200).json(data)
    } catch (err) {
        console.log(err.message)
        res.status(404).json({ message: err.message })
    }
}