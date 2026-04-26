const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// This single line tells Express to serve your HTML, CSS, and JS files to the browser
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
    console.log(`Frontend Server is running at http://localhost:${PORT}`);
});