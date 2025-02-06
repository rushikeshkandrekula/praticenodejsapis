import express from 'express';
import app1 from './controller/api';
import { mongoconn } from './dbconnection';
import { empschema } from './mongodbschema/empschema';
import cors from 'cors'


const app = express();
app.use(express.json());
app.use(cors())


const PORT = 3000;
app.listen(PORT, () => {
    console.log("Connected to" + PORT)
})
mongoconn();


app.use('/MongoDB',app1)