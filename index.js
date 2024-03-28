require("dotenv").config();
const { MongoClient } = require("mongodb");
const functions = require("@google-cloud/functions-framework");

const uri = process.env.MONGODB_UR;
const client = new MongoClient(uri);

functions.http("helloHttp", async (req, res) => {
  const authHeader = req.headers.authorization;
  const collectionName = req.body.collection;
  const aggregationPipeline = req.body.aggregation; // Usar um pipeline de agregação

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized!" });
  }

  const token = authHeader.split(" ")[1];
  const BEARER_TOKEN = process.env.TOKEN;
  if (token !== BEARER_TOKEN) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (!collectionName || !aggregationPipeline) {
    // Certifique-se de que o pipeline de agregação foi passado
    return res.status(400).json({
      message:
        "It is necessary to pass collection and aggregation pipeline in the body of the request",
    });
  }

  try {
    await client.connect();
    const collection = client.db("test").collection(collectionName);
    const data = await collection.aggregate(aggregationPipeline).toArray(); // Use o método aggregate()

    res.json({
      data,
    });
  } catch (error) {
    console.error("Error executing aggregation query:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  } finally {
    await client.close();
  }
});
