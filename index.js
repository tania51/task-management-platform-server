const express = require('express')
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.port || 5002;


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.jwathvu.mongodb.net/?retryWrites=true&w=majority`;

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

    const createTaskCollection = client.db('taskManagement').collection('createTask');

    app.post('/createTask', async(req, res) => {
        const tasks = req.body;
        const result = await createTaskCollection.insertOne(tasks);
        res.send(result)
    })

    // get all task for dashboard
    app.get('/allTask', async(req, res) => {
      const result = await createTaskCollection.find().toArray();
      res.send(result)
    })

    // get single task for edit
    app.get('/allTask/:id', async(req, res) => {
      const query = req.params.id;
      const id = { _id: new ObjectId(query) }
      const result = await createTaskCollection.findOne(id);
      res.send(result)
    })

    // delete single task
    app.delete('/allTasks/:id', async(req, res) => {
      const query = req.params.id;
      const id = { _id: new ObjectId(query) }
      const result = await createTaskCollection.deleteOne(id);
      res.send(result)
    })

    // edit single task
    app.patch('/allTasks/:id', async(req, res) => {
      const query = req.body;
      const id = req.params.id;
      console.log(query, id);
      const filter = { _id: new ObjectId(id) }

      const updateDoc = {
        $set: {
          Title: query.Title,
          Description: query.Description,
          Deadlines: query.Deadlines,
          Priority: query.Priority,
        }
      }

      const result = await createTaskCollection.updateOne(filter, updateDoc)
      res.send(result)
    })
    


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})