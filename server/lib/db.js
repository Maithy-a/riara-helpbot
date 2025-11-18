import { MongoClient } from "mongodb";

export async function dbConnection(mongoUri, mongoDbName) {
    if (!mongoUri) {
        throw new Error("MongoDB URI is not provided");
    }
    if (!mongoDbName) {
        throw new Error("MongoDB DB name is not provided");
    }

    const client = new MongoClient(mongoUri);
    await client.connect();

    const db = client.db(mongoDbName);

    console.log("Connected to MongoDB:", mongoDbName);

    return { client, db };
}
