import express from "express";
import { createServer } from "node:http";
import httpStatus from "http-status";
import dotenv from 'dotenv';
dotenv.config();
import dbConnect from "./src/init/index.js";

const app = express();
const server = createServer(app);  


const startServer = async () => {

    dbConnect()
    
    app.get("/" , (req ,res) => {
        res.json({ status: ` ${httpStatus.OK}, server is running ` });
    })

    server.listen(8000, () => {
        console.log("Server is running on port 8000");
    });

}

startServer();

   