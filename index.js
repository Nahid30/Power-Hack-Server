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

async function run() {
    try {
        await client.connect();
        const billCollection = client.db("powerHack").collection("bill");


        app.get('/signup')
        
        // GET 
        app.get('/bill', async(req, res) => {
            // const query = {};
            // const cursor = billCollection.find(query);
            // const bills = await cursor.toArray();
            // res.send(bills);

            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = billCollection.find(query);
            let bills;
            if(page || size){
                bills = await cursor.skip(page*size).limit(size).toArray();
            }
            else{
                bills = await cursor.toArray();
            }
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


        

        // PATCH 
        app.patch('/bill/:id', async (req, res) => {
            const id = req.params.id;
            const updateBill = req.body;
            const filter = { id: id };
            const updateDoc = {
                $set: updateBill,
            };
            const result = await billCollection.updateOne(filter, updateDoc);
            res.send(result);
        })


        app.get('/billCount', async(req,res)=>{
           
            const count = await billCollection.estimatedDocumentCount();
           
            res.send({count})
        })



    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send("Hello From Power Hack")
});

app.listen(port, () => {
    console.log('Listening to port', port)
});


