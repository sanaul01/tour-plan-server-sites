const express = require("express")
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config()
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hcshw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db("TourPlan");
        const servicesCollection = database.collection("services");
        const usersCollection = database.collection("users");

        // POST Api 
        app.post('/services', async(req, res)=>{
            const service = req.body
            console.log("hit the post api", service)
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });

        // added users in database 
        app.post('/users', async(req, res)=>{
            const user = req.body;
            console.log('added users', user)
            const result =await usersCollection.insertOne(user);
            res.json(result)
        })

        // Get api 
        app.get('/services', async(req, res)=>{
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // Get A service 
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id; 
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service)
        });

        // find my service 
        app.get('/myservice/:email', async(req, res)=>{
            const result = await servicesCollection.find({email: req.params.email}).toArray();
            res.send(result)
        })

        // Delete api 
        app.delete('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.deleteOne(query);
            res.json(service);
        });



    }
    finally {
        // await client.close();
      }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('Tour Plan')
});

app.listen(port, ()=>{
    console.log("listening", port)
});