const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//middlewire
app.use(cors());
app.use(express.json());







const uri = "mongodb+srv://mydbuser1:LyoCqnCvHLZQC5wF@cluster0.da9dr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("foodmaster");
        const usersCollection = database.collection("users");
        //get api
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })
        //post api
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);

            console.log('hitting the post', req.body);
            console.log('added user', result);
            res.send(result);

        })
        //update api
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            console.log('Updating User', updateUser);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateUser.name,
                    email: updateUser.email
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);

            res.send(result);
        })
        //single update
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await usersCollection.findOne(query);
            console.log('load user with id: ', id);
            res.send(user);
        })
        //delete api
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log('delete id: ', id);
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            res.json(result);
        })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running my crud server');
})
app.listen(port, () => {
    console.log('running server :', port);
})