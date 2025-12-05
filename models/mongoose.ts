import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please add the MONGODB_URI environment variable');
}

// Now TypeScript knows MONGODB_URI is a string
const mongoUri: string = MONGODB_URI;

// Extend the global object to store cached connection
declare global {
  var _mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Use global cache to prevent multiple connections in dev
const cached = global._mongoose || { conn: null, promise: null };

export async function connect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  global._mongoose = cached;

  return cached.conn;
}
