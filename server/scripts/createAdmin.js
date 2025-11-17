import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

async function createAdmin() {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        const db = client.db(process.env.MONGO_DB);

        const username = process.env.ADMIN_USERNAME;
        const password = process.env.ADMIN_PASSWORD;
        const passwordHash = await bcrypt.hash(password, 10);

        await db.collection("admins").insertOne({
            username,
            passwordHash,
            createdAt: new Date()
        });
        console.log(`Admin user '${username}' created successfully.`);

    } catch (error) {
        console.error("Error creating admin user:", error);
    } finally {
        await client.close();
    }
}

createAdmin();
