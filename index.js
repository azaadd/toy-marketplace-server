const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

async function run() {https://github.com/azaadd/toy-marketplace-server/blob/main/index.js
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect();


        const serviceCollection = client.db('toyMarket').collection('customers');
        const addCollection = client.db('toyMarket').collection('sellers');

        app.get('/customers', async(req, res) => {
            console.log(req.query);
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const skip = (page - 1) * limit;

            const cursor = serviceCollection.find().skip(skip).limit(limit);
            const result = await cursor.toArray();
            res.send(result);
        })

        // app.get('/customers', async(req, res) => {
        //     const result = await serviceCollection.estimatedDocumentCount();
        //     res.send({customers: result})
        // })


        //pagination
        app.get('/totalProducts', async(req, res) => {
            const result = await serviceCollection.estimatedDocumentCount();
            res.send({totalProducts: result})
        })


        app.get('/customers/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await serviceCollection.findOne(query);
            res.send(result);
        })


        // add toys
        app.get('/sellers', async(req, res) => {
            console.log(req.query.email);

            let query = {};
            if(req.query?.email) {
                query = { email: req.query.email}
            }
            const result = await addCollection.find(query).toArray();
            res.send(result);
        })
        


        app.get('/sellers/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await addCollection.findOne(query);
            res.send(result);
        })



        app.post('/sellers', async(req, res) => {
            const seller = req.body;
            console.log(seller);
            const result = await addCollection.insertOne(seller);
            res.send(result);
        });

        app.put('/sellers/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)};
            const options = {upsert: true};
            const updatedToy = req.body;
            const toy = {
                $set: {
                    rating: updatedToy.rating, 
                    toyname: updatedToy.toyname, 
                    photo: updatedToy.photo, 
                    description: updatedToy.description, 
                    quantity: updatedToy.quantity, 
                    price: updatedToy.price, 
                    category: updatedToy.category
                }
            }

            const result = await addCollection.updateOne(filter, toy, options);
            res.send(result);
        })


        app.delete('/sellers/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await addCollection.deleteOne(query);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
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
