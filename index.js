require("dotenv").config();
const { MongoClient } = require("mongodb");
const functions = require("@google-cloud/functions-framework");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

functions.http("helloHttp", async (req, res) => {
  const authHeader = req.headers.authorization;
  const collectionName = req.body.collection;
  const query = req.body.query;
  const aggregationPipeline = req.body.aggregation;

  console.log("🚀 ~ query:", query ? query : null);
  console.log("🚀  aggregationPipeline:", aggregationPipeline);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized!" });
  }

  const token = authHeader.split(" ")[1];
  const BEARER_TOKEN = process.env.TOKEN;
  if (token !== BEARER_TOKEN) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (!collectionName) {
    return res.status(400).json({
      message:
        "It is necessary to pass the collection in the body of the request",
    });
  }

  try {
    await client.connect();
    const collection = client.db("test").collection(collectionName);
    let data;

    if (query) {
      data = await collection.find(query).toArray();
    } else if (aggregationPipeline) {
      data = await collection.aggregate(aggregationPipeline).toArray();
    } else {
      return res.status(400).json({
        message:
          "No query or aggregation pipeline provided in the request body",
      });
    }

    res.json({ data });
  } catch (error) {
    console.error("Error with database operation:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  } finally {
    await client.close();
  }
});
