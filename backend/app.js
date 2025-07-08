import express from "express";
import { createServer } from "node:http";
import httpStatus from "http-status";

const app = express();
const server = createServer(app);  

 server.listen(8000, () => {
        console.log("Server is running on port 8000");
    });

    app.get("/" , (req ,res) => {
        res.json({ status: ` ${httpStatus.OK}, server is running ` });
    })   