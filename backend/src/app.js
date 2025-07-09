import express from "express";
import { createServer } from "node:http";
import httpStatus from "http-status";
import dotenv from 'dotenv';
dotenv.config();
import cors from "cors";
import dbConnect from "./init/index.js";
import cookieParser from "cookie-parser";

const app = express();
const server = createServer(app);  

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

import userRouter from "./routes/userRoutes.js"
import reportRouter from "./routes/reportRoutes.js";
import exerciseRouter from "./routes/exerciseRoutes.js"

app.use("/api/users", userRouter);
app.use("/api/reports", reportRouter)
app.use("/api/exercises", exerciseRouter)

const startServer = async () => {

    dbConnect()
    
    app.get("/" , (req ,res) => {
        res.json({ status: ` ${httpStatus.OK}, server is running ` });
    })

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

}

startServer();

   