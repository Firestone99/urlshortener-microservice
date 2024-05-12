require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// Object to store original and short URLs
const urlDatabase = {};
let shortUrlCounter = 1;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Endpoint to shorten URLs
app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;

  // Check if URL is valid
  const urlRegex = /^(https?:\/\/)?(www\.)?[a-z0-9\.-]+\.[a-z]{2,}\/?/i;
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Generate short URL
  const shortUrl = shortUrlCounter++;
  urlDatabase[shortUrl] = originalUrl;

  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// Endpoint to redirect to original URL
app.get('/api/shorturl/:short_url', function(req, res) {
  const shortUrl = req.params.short_url;
  const originalUrl = urlDatabase[shortUrl];

  if (!originalUrl) {
    return res.json({ error: 'invalid short url' });
  }

  res.redirect(originalUrl);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
