const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/SUBMIT-STORY', async (req, res) => {
    const { childAge, preferredLanguage, storyGenre, artworkStyle, storyPrompt } = req.body;
    
    const prompt = `Create a story for a child aged ${childAge} in ${preferredLanguage} about ${storyGenre} with an artwork style of ${artworkStyle}. Story Prompt: ${storyPrompt}`;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages : 
            [
                {
                    role: 'system',
                    content: 'You are a writer for a children\'s book company. You have been asked to write a story for a child aged in about  with an artwork style of. Story Prompt: '
                },
                {
                    role: 'user',
                    content: 'Create a story for a child aged ${childAge} in ${preferredLanguage} about ${storyGenre}. Furthermore, generate a prompt for dalle for the generated story with an artwork style of ${artworkStyle}.'
                }
            ],
            n: 1,
            stop: null,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        console.log("Response from api: ", response.data);
        res.json({ story: response.data.choices[0].text });
        console.log("Generated message:", response.data.choices[0].message.content);

    } catch (error) {
        console.error('Error:', error.response.data);
        res.status(500).send('Error generating story');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
