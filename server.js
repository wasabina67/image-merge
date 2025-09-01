const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the docs directory
app.use(express.static(path.join(__dirname, 'docs')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log('Serving documentation from the docs directory');
});