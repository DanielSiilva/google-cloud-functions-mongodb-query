require("dotenv").config();
const { MongoClient } = require("mongodb");
const functions = require("@google-cloud/functions-framework");

const uri = process.env.MONGOBD_URL;
const client = new MongoClient(uri);

functions.http("helloHttp", async (req, res) => {
  const authHeader = req.headers.authorization;
  const collectionName = req.body.collection;
  const query = req.body.query;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized!" });
  }

  const token = authHeader.split(" ")[1];
  const BEARER_TOKEN = process.env.TOKEN;
  if (token !== BEARER_TOKEN) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (!collectionName || !query) {
    return res.status(400).json({
      message:
        "It is necessary to pass collection and query the body the request",
    });
  }

  try {
    await client.connect();
    const collection = client.db("test").collection(collectionName);
    const data = await collection.find(query).toArray();

    res.json({
      data,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  } finally {
    await client.close();
  }
});
