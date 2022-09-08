require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
// Replace with your Public API Key.
const apiKey = process.env.API_KEY;
const port = process.env.PORT || 3001;

const handleError = (err) => {
  // The requested Builder content could not be found.
  if (err.response.status === 404) {
    return { data: null };
  }
  throw err;
};

// Catchall route
app.get('*', async (req, res) => {
  const encodedUrl = encodeURIComponent(req.url);
  const { data: pageData } = await fetch(
    `https://cdn.builder.io/api/v1/html/page?apiKey=${apiKey}&url=${encodedUrl}`
  )
    .then((res) => res.json())
    .catch(handleError);
  if (pageData) {
    const pageHtml = pageData.html;

    res.send(`
      <html>
        <head> <!-- Your head content here --> </head>
        <body>
           ${pageHtml}
        </body>
      </html>
    `);
  } else {
    res.status(404);
    res.send(/* Your 404 page HTML */);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
