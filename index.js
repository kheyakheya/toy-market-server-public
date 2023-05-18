const express = require ('express') ;
const cors= require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


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
    // index of search 
    const indexKeys = { toyName: 1 }; // Replace field1 and field2 with your actual field names
    const indexOptions = { name: "toyName" }; // Replace index_name with the desired index name
    const result = await toyCollection.createIndex(indexKeys, indexOptions);
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    // get all toy
    app.get('/allToys', async(req,res)=>{
      const result= await toyCollection.find().limit(20).toArray();
      res.send(result);

    })
    // get all toy by category
    app.get("/allToys/:category", async (req, res) => {
      
      const result = await toyCollection
        .find({
          category: req.params.category,
        })
        .toArray();
      res.send(result);
    });
    // get single toy
    app.get('/toy/:id', async(req,res)=>{
      const id= req.params.id;
      const query= {_id: new ObjectId(id)};
      const result = await toyCollection.findOne(query);
      res.send(result);
    })
    // get toys by search
    app.get('/search/:text', async(req,res)=>{
      const search= req.params.text;
      const result= await toyCollection.find({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ],
      }).toArray();
      res.send(result)
    })
    // get toys by email
    app.get('/myToys/:email', async(req,res)=>{
      const text= req.params.email;
      const query= {email: text };
      const result= await toyCollection.find(query).toArray();
      res.send(result);
    })
    // post toys
    app.post('/allToys', async (req,res)=>{
      const toy= req.body;
      const result= await toyCollection.insertOne(toy);
      res.send(result)
    })
    // update a toy
    app.put('/update/:id', async(req,res)=>{
      const id=req.params.id;
      console.log(id);
      const updatedToy= req.body;
      const filter= {_id: new ObjectId(id)};
      const updateDoc={
        $set:{
          price: updatedToy.price,
          quantity: updatedToy.quantity,
          description: updatedToy.description

        }
      }
      const result= await toyCollection.updateOne(filter,updateDoc);
      res.send(result);

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
