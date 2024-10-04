const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

app.get('/favicon.ico', (req, res) => res.status(200).send());

app.use(express.static('./src'));

let items = [];

app.post('/api/users', (req, res) => {
    const users = req.body;
    items.push(...users);
    res.status(200).send('Users were successfully received and saved');
});

app.get('/api/items', (req, res) => {
    res.json(items);
});

app.delete('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    items = items.filter((item) => item.id !== id);
    res.status(200).json({message: 'Item deleted successfully'});
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
