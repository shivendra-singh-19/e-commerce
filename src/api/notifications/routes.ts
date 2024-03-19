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

NotificationRouter.get("/bull/queue/test", async (req, res) => {
  const object = req.body;
  const options = {};
  const apiResponse = await NotificationsAPI.testBullQueue(object, options);
  res.send(apiResponse);
});

NotificationRouter.get("/bull/queue/test1", async (req, res) => {
  const object = req.body;
  const options = {};
  const apiResponse = await NotificationsAPI.testBullQueueTest1(
    object,
    options
  );
  res.send(apiResponse);
});

NotificationRouter.get("/bull/queue/test2", async (req, res) => {
  const object = req.body;
  const options = {};
  const apiResponse = await NotificationsAPI.testBullQueueTest2(
    object,
    options
  );
  res.send(apiResponse);
});

NotificationRouter.get("/bull/queue/test3", async (req, res) => {
  const object = req.body;
  const options = {};
  const apiResponse = await NotificationsAPI.testBullQueueTest3(
    object,
    options
  );
  res.send(apiResponse);
});
