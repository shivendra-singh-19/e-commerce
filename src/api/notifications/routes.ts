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

NotificationRouter.get("/bull/queue/progress/", async (req, res) => {
  const object = req.body;
  const options = {};
  const apiResponse = await NotificationsAPI.bullProgress(object, options);
  res.send(apiResponse);
});

NotificationRouter.get("/bull/queue/multipleJobs", async (req, res) => {
  const object = req.body;
  const options = {};
  const apiResponse = await NotificationsAPI.multipleJobs(object, options);
  res.send(apiResponse);
});

NotificationRouter.get("/bull/queue/job/retry", async (req, res) => {
  const object = req.body;
  const options = {};
  const apiResponse = await NotificationsAPI.jobRetries(object, options);
  res.send(apiResponse);
});

NotificationRouter.post("/bull/queue/job/kill", async (req, res) => {
  const object = req.body;
  const options = {};
  const apiResponse = await NotificationsAPI.killJob(object, options);
  res.send(apiResponse);
});

NotificationRouter.get("/bull/queue/prioty-based-jobs", async (req, res) => {
  const object = req.body;
  const options = {};
  const apiResponse = await NotificationsAPI.createPriorityBasedJobs(
    object,
    options
  );
  res.send(apiResponse);
});

NotificationRouter.get("/bull/queue/worker", async (req, res) => {
  const object = req.body;
  const options = {};
  const apiResponse = await NotificationsAPI.createForWorker(object, options);
  res.send(apiResponse);
});
