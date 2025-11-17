import { MongoClient } from "mongodb";

export async function dbConnection(mongoUri) {
    if (!mongoUri) {
        throw new Error("MongoDB URI is not provided");
    }

    const client = new MongoClient(mongoUri);
    await client.connect();
    console.log("Connected to MongoDB");

    return { client };
}
