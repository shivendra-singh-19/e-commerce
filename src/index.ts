import fs from "fs";
import mongoose from "mongoose";
import express, { Request, Response } from "express";
import { UserAccountRouter } from "./api/users/routes";
import { ItemsListingRouter } from "./api/items/routes";
import { NotificationRouter } from "./api/notifications/routes";
import { createClient } from "redis";

const configFile = fs.readFileSync(
  __dirname + "/../config/config.development.json",
  "utf-8"
);
export const config = JSON.parse(configFile);

const { server, database } = config;
const { port } = server;
const { url, name, enableDebugger } = database;
mongoose.connect(`${url}/${name}`);
mongoose.set("debug", enableDebugger);

const app = express();
app.use(express.json());

const redisConfig = config.redis;

export const redisClient = createClient({ ...redisConfig });
redisClient.on("error", (err) => console.log("Redis Client Error", err));

redisClient.connect();

redisClient.on("connect", () => {
  console.log("Redis connection established");
});

app.get("/health", (req: Request, res: Response) => {
  res.send("Running");
});

app.use("/user", UserAccountRouter);

app.use("/items", ItemsListingRouter);

app.use("/notifications", NotificationRouter);

app.listen(port, (): void => {
  console.log(`Server Running at ${port}`);
});
