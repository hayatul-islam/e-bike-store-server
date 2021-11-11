const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r9gms.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("eBikeStore");
        const productsCollection = database.collection("products");
        const ordersCollection = database.collection("orders");

        // all products
        app.get('/products', async (req, res) => {
            const products = await productsCollection.find({}).toArray();
            res.send(products);
        });

        // single service
        app.get("/products/:id", async (req, res) => {
            const result = await productsCollection
                .find({ _id: ObjectId(req.params.id) })
                .toArray();
            res.send(result[0]);
        });

        // add order
        app.post('/addOrder', async (req, res) => {
            const order = await ordersCollection.insertOne(req.body);
            res.send(order)
        });

        // my orders
        app.get('/myOrders/:email', async (req, res) => {
            const myOrders = await ordersCollection.find({ email: req.params.email }).toArray();
            res.send(myOrders)
        })

        // delete my orders
        app.delete('/delete/:id', async (req, res) => {
            const query = { _id: ObjectId(req.params.id) };
            const result = await ordersCollection.deleteOne(query);
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})