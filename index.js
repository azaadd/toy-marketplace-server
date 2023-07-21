const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');


// const toys = require('./data/toys.json');

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Toy is runnig')
});

// app.get('/toys', (req, res) => {
//     res.send(toys)
// })

// app.get('/toys/:id', (req, res) => {
//     const id = req.params.id;
//     console.log('need data for id:', id);
//     const toy = toys.find(toy => toy._id === id) || {}
//     res.send(toy);
// })

app.listen(port, () => {
    console.log(`Toy API is running on port: ${port}`)
})