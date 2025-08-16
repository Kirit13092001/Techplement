const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/api/quote', async (req, res) => {
  try {
    // Fetch a random quote from ZenQuotes free API
    const response = await axios.get('https://zenquotes.io/api/random');
    // ZenQuotes returns an array with one quote object
    const quoteData = response.data[0];

    res.json({
      text: quoteData.q,
      author: quoteData.a
    });
  } catch (error) {
    console.error('Error fetching quote:', error.message);
    res.status(500).json({ error: 'Unable to fetch quote' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

