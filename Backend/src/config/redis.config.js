import {createClient} from "redis";
import dotnev from "dotenv";

dotnev.config();

const redisClient = createClient({
    url : process.env.REDIS_URL
});

redisClient.on("error", (error)=>{
    console.log("redis error : ",error);
})

redisClient.on("connect",()=>{
    console.log("connected to redis"); 
})

export const connectRedis = async () => {
    await redisClient.connect();
    await redisClient.set("key","redis");
    const data = await redisClient.get("key");
     console.log(data);
}

export default redisClient;