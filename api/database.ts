import * as mongodb from 'mongodb';
import { mongo } from './config';

const full_url = mongo.full_url;
const url = mongo.url;
const username = mongo.user;
const password = mongo.password;

export const databaseClient = new mongodb.MongoClient(url, { auth: { username, password } });

// full driver code example!!!!!

// const { MongoClient } = require('mongodb');
// const uri = "mongodb+srv://fullstack:<password>@cluster0.nkjni.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
