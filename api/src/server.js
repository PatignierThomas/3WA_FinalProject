import express from 'express';
import "dotenv/config";

const app = express();

const dotenv = process.env;

const PORT = dotenv.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});