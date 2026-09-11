// Hello World Web Service
// A minimal web service built with Node.js and Express.
// Visiting the root URL returns a friendly "Hello World" greeting,
// and a bonus /hello/:name route greets whoever you tell it to.

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World! 👋 Welcome to my very first web service.');
});

// A little personality: greet a name if one is provided in the URL.
app.get('/hello/:name', (req, res) => {
  const { name } = req.params;
  res.send(`Hello, ${name}! Thanks for stopping by my web service.`);
});

app.listen(PORT, () => {
  console.log(`Hello World web service is running at http://localhost:${PORT}`);
});
