require("dotenv").config();
const { MongoClient } = require("mongodb");
const functions = require("@google-cloud/functions-framework");

const uri = process.env.MONGOBD_URL;
const client = new MongoClient(uri);

functions.http("helloHttp", async (req, res) => {
  res.send(`Heloo word ${req.body.query}`);
});
