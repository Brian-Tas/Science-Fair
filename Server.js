const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000; // Choose a port number

// Serve static files from the Public directory
app.use(express.static(path.join(__dirname, 'Public')));
// Serve static files from the Brain directory
app.use('/brain', express.static(path.join(__dirname, 'Brain')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});