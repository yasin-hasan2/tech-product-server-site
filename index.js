const express = require('express');
require('dotenv').config()
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// middleware 
// app.use(cors());
const corsConfig = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}
app.use(cors(corsConfig));
app.use(express.json());


//===============================================>



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3tdkdjy.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();


        const productsCollection = client.db("buntydb").collection("products");
        const usersCollection = client.db('buntydb').collection('users')
        const reviewCollection = client.db("buntydb").collection("review");




        app.get("/products", async (req, res) => {
            const result = await productsCollection.find().toArray();
            res.send(result);
        })

        app.get("/products/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }

            const options = {
                projection: { name: 1, image: 1, description: 1, price: 1, upvote_count: 1 }
            }

            const result = await productsCollection.findOne(query, options)
            res.send(result)
        })


        app.post('/users', async (req, res) => {
            const users = req.body
            const result = await usersCollection.insertOne(users)
            console.log(result)
            res.send(result)
        })

        app.get('/users', async (req, res) => {
            let query = {}
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const users = await usersCollection.find(query).toArray();
            console.log("this is users", users)
            res.send(users)
        })

        app.post('/review', async (req, res) => {
            const review = req.body
            const result = await reviewCollection.insertOne(review)
            console.log(result)
            res.send(result)
        })

        app.get('/review', async (req, res) => {
            const review = await reviewCollection.find().toArray()
            console.log("your comment", review)
            res.send(review)

        })




        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


//===============================================>




app.get('/', (req, res) => {
    res.send('hunt is bitting')
})

app.listen(port, () => {
    console.log(`product hunt is bitting on port`)
})