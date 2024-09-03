import { MongoClient } from "mongodb";
const connectionString = "mongodb+srv://hcostaa:admin@adadproject.r6s6gz9.mongodb.net/";
const client = new MongoClient(connectionString);
let conn;
try {
conn = await client.connect();
} catch(e) {
console.error(e);
}
// Database name
let db = conn.db("ADADProject");
export default db;
