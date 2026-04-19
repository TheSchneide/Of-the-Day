const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname)));

app.get('/api/content', (req, res) => {
    
    const filePath = path.join(__dirname, 'inspirational_content.json');
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).send("Server Error");
            return;
        }
        res.json(JSON.parse(data));
    });
});
app.listen(PORT, () => {
    console.log(`Node.js Server is running at http://localhost:${PORT}`);
});