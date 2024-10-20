"use server"
import mongoose from "mongoose"

let isConnected = false

export const connectToDB = async () => {
    // if (!process.env.MONGODB_URL) return console.log("MONGODB_URL Not Found");
    if (isConnected) return console.log("Mongo DB is Already Connected");

    mongoose.connect("mongodb://localhost:27017/ThreadApp")
        .then(() => {
            isConnected = true
            console.log("MongoDB Connected")
        }).catch((err) => {
            console.log("mongo db errrrrrrror", err)
        })
} 