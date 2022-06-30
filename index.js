const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json());




const uri = "mongodb+srv://PowerHack2:nGkMIUOl3VBcGCW8@cluster0.4l6ze.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   console.log('db connected mamu')
//   client.close();
// });

async function run() {
    try {
        await client.connect();
        const billCollection = client.db("powerHack").collection("bill");
        
        // GET 
        app.get('/bill', async(req, res) => {
            const query = {};
            const cursor = billCollection.find(query);
            const bills = await cursor.toArray();
            res.send(bills);
        });

        //POST
        app.post('/bill', async (req, res) => {
            const addNewBill = req.body;
            const result = await billCollection.insertOne(addNewBill);
            res.send(result);
        }) 

        //DELETE
        app.delete('/bill/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await billCollection.deleteOne(query);
            res.send(result);

        })

    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);



// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p0sri.mongodb.net/?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });







app.get('/', (req, res) => {
    res.send("Hello From Power Hack")
});

app.listen(port, () => {
    console.log('Listening to port', port)
});


