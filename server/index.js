import express from "express";
import dotenv from "dotenv";

const server = express();

dotenv.config();

server.listen(process.env.PORT, () =>
  console.log(`Server Started Successfully at http://localhost:${process.env.PORT}/`)
);
