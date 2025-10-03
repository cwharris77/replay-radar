import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

interface GlobalWithMongoClientPromise {
  _mongoClientPromise?: Promise<MongoClient>;
}

const globalWithMongo = global as typeof global & GlobalWithMongoClientPromise;

if (process.env.NODE_ENV === "development") {
  // In dev, use a global var to avoid creating new clients on hot reload
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In prod, always create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
