const express = require ('express') ;
const cors= require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');


const app= express();
const port= process.env.PORT || 5000;
// middle ware
app.use(cors());
app.use(express.json());
// mongo db code
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dvb9ofq.mongodb.net/?retryWrites=true&w=majority`;

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
    const toyCollection=client.db('toyDb').collection('toys');
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    // post toys
    app.post('/allToys', async (req,res)=>{
      const toy= req.body;
      console.log("toypost",toy)
      const result= await toyCollection.insertOne(toy);
      res.send(result)
    })




  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// check server
app.get('/', (req,res)=>{
    res.send(" eleven running")
});
app.listen(port,()=>{
    console.log(` practice running port ${port}`)
})
