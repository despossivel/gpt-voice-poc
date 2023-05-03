import fetch from 'node-fetch';

export default async function Gpt(dataJSON) {
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.API_KEY_OPENIA}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [{ "role": "user", "content": dataJSON.text }],
            "temperature": 0.7
        })
    };

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options);
        const body = await response.json();
        return body.choices[0].message.content;
    } catch (error) {
        throw new Error(error);
    }
}
