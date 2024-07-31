const express = require('express');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // Ensure node-fetch is installed

const app = express();
const PORT = process.env.PORT || 3000;
const REBRICKABLE_API_KEY = '66f85a9f08eb2cdb83b8d778c183712a';

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).send({ error: 'Query parameter is required' });
    }

    try {
        const response = await fetch(`https://rebrickable.com/api/v3/lego/sets/?search=${query}&key=${REBRICKABLE_API_KEY}`);
        const data = await response.json();
        
        // Save results to JSON file
        fs.writeFileSync(path.join(__dirname, 'public', 'searchResults.json'), JSON.stringify(data));

        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send({ error: 'Error fetching data' });
    }
});

app.get('/results', (req, res) => {
    fs.readFile(path.join(__dirname, 'public', 'searchResults.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send({ error: 'Error reading results file' });
        }
        res.send(data);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
