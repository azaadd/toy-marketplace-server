const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');


// const toys = require('./data/toys.json');

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_SECRET}@cluster0.chhf73q.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);



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