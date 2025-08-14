import mongoose from 'mongoose'

let MONGODB_URI = process.env.MONGO_DB_URL

if (!MONGODB_URI) {
  throw new Error('Please define the MONGO_DB_URL environment variable inside .env.local')
}

// Define the cache interface
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Extend global to include mongoose cache
declare global {
  var mongoose: MongooseCache | undefined
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      // Add connection timeout
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      // Add retry options
      retryWrites: true
    }

    console.log('Connecting to MongoDB...')
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('MongoDB connected successfully')
      return mongoose
    }).catch((error) => {
      console.error('MongoDB connection error:', error)
      throw error
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error('Failed to connect to MongoDB:', e)
    throw e
  }

  return cached.conn
}

export default dbConnect 