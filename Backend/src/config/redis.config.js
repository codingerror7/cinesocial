import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

let isConnected = false;
let client = null;

if (process.env.REDIS_URL) {
  try {
    client = createClient({
      url: process.env.REDIS_URL,
      socket: {
        connectTimeout: 5000,
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.warn("Redis reconnectStrategy: max retries reached, disabling Redis");
            isConnected = false;
            return false; // stop reconnecting
          }
          return Math.min(retries * 500, 2000);
        }
      }
    });

    client.on("error", (error) => {
      console.warn("Redis client warning/error: ", error.message || error);
    });

    client.on("connect", () => {
      console.log("Connected to Redis");
      isConnected = true;
    });

    client.on("end", () => {
      console.log("Redis connection closed");
      isConnected = false;
    });
  } catch (err) {
    console.error("Failed to initialize Redis client:", err);
  }
} else {
  console.log("REDIS_URL not set in env, caching is disabled.");
}

export const connectRedis = async () => {
  if (!client) return;
  try {
    await client.connect();
    // Test the connection
    await client.set("connection_test", "ok");
    await client.del("connection_test");
    isConnected = true;
  } catch (error) {
    console.warn("Could not connect to Redis. Caching will be disabled. Error:", error.message || error);
    isConnected = false;
  }
};

// Safe wrapper proxy to intercept exceptions and prevent 500 crashes
const redisWrapper = {
  get: async (key) => {
    if (!isConnected || !client) return null;
    try {
      return await client.get(key);
    } catch (err) {
      console.warn(`Redis GET failed for key "${key}":`, err.message || err);
      return null;
    }
  },
  set: async (key, value) => {
    if (!isConnected || !client) return null;
    try {
      return await client.set(key, value);
    } catch (err) {
      console.warn(`Redis SET failed for key "${key}":`, err.message || err);
      return null;
    }
  },
  setEx: async (key, seconds, value) => {
    if (!isConnected || !client) return null;
    try {
      return await client.setEx(key, seconds, value);
    } catch (err) {
      console.warn(`Redis SETEX failed for key "${key}":`, err.message || err);
      return null;
    }
  },
  del: async (key) => {
    if (!isConnected || !client) return null;
    try {
      return await client.del(key);
    } catch (err) {
      console.warn(`Redis DEL failed for key "${key}":`, err.message || err);
      return null;
    }
  }
};

export default redisWrapper;