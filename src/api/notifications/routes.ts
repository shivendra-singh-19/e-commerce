import express from "express";
import { NotificationsAPI } from "./NotificationsAPI";

export const NotificationRouter = express.Router();

// /notifications/
NotificationRouter.post("/schedule", async (req, res) => {
  const object = req.body;
  const options = {};
  const apiResponse = await NotificationsAPI.scheduleNotificationTest(
    object,
    options
  );
  res.send(apiResponse);
});

NotificationRouter.get("/cpu-bench", async (req, res) => {
  const object = req.body;
  const options = {};
  const apiResponse = await NotificationsAPI.cpuIntensiveTask(object, options);
  res.send(apiResponse);
});

NotificationRouter.get("/redis/ping", async (req, res) => {
  const object = req.body;
  const options = {};
  const apiResponse = await NotificationsAPI.checkRedisStatus(object, options);
  res.send(apiResponse);
});
