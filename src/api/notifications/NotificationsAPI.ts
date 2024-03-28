import { promisify } from "util";
import Bull from "bull";
import { config, redisClient } from "../..";

import {
  IProducerNotification,
  ProducerNotificationModel,
} from "../../Models/ProducerNotificationModel";
import { NotificationUtils } from "../../utils/NotificationUtils";

const sleep = promisify(setTimeout);

export class NotificationsAPI {
  /**
   * With rabbitmq
   * @param object
   * @param options
   * @returns
   */
  static async scheduleNotificationTest(object: any, options: any) {
    const formattedDate = new Date(object.date);
    const reqBody: IProducerNotification = {
      scheduledAt: formattedDate,
      result: object.result,
      resultMultiple: object.multiple,
      message: object.message,
    };

    const notificationTest = await new ProducerNotificationModel(
      reqBody
    ).save();

    await NotificationUtils.scheduleNotification(notificationTest);

    return {
      message: `Process scheduled with Id ${notificationTest}`,
    };
  }

  /**
   * Performing cpu intensive task involving workers
   * @param object
   * @param options
   * @returns
   */
  static async cpuIntensiveTask(object: any, options: any) {
    const tock = performance.now();
    const test = await NotificationUtils.cpuIntensiveTask(object, {});
    const tick = performance.now();
    return {
      message: `Main thread took ${(await test).totalTime}`,
    };
  }

  static async checkRedisStatus(object: any, options: any) {
    return {
      message: await redisClient.ping(),
    };
  }

  /**
   * Testing first job scheduling for bull queue using Bull npm package
   * @param object
   * @param options
   * @returns
   */
  static async testBullQueue(object: any, options: any) {
    const { redis } = config;
    const redisOptions = {
      redis,
    };

    const burgerQueue = new Bull("burger", redisOptions);

    burgerQueue.process((payload, done) => {
      console.log("Preparing burger....!");
      const timeOut: number = Math.random() * 10 * 10000;
      setTimeout(() => {
        console.log("Burger is ready...!");
        done();
      }, timeOut);
    });

    burgerQueue.add({
      bun: "Bun",
      cheese: "cheese",
      toppings: ["tomato", "capsicum", "spinach", "chilli"],
    });

    return {
      message: "Task scheduled after 4 seconds",
    };
  }

  static async bullProgress(object: any, options: any) {
    const { redis } = config;
    const redisOptions = {
      redis,
    };

    const burgerQueue = new Bull("burger", redisOptions);
    burgerQueue.process(async (payload, done) => {
      try {
        payload.log("Grill the patty");
        payload.progress(20);
        await sleep(5000);

        payload.log("Toast the bun");
        payload.progress(40);
        await sleep(5000);

        payload.log("Add the toppings");
        payload.progress(60);
        await sleep(5000);

        payload.log("Assemble the layers");
        payload.progress(80);
        await sleep(5000);

        payload.log("Burger ready");
        payload.progress(100);
        await sleep(5000);

        done();
      } catch (err: any) {
        done(err);
      }
    });

    burgerQueue.add({
      bun: "Bun",
      cheese: "cheese",
      toppings: ["tomato", "capsicum", "spinach", "chilli"],
    });

    return {
      message: "Task has been scheduled",
    };
  }

  static async multipleJobs(object: any, options: any) {
    const { redis } = config;
    const redisOptions = {
      redis,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    };

    const sleepTime = object.sleepTime * 1000 ?? 2000;
    const totalJobs = object.totalJobs ?? 10;
    const concurrency = object.concurrency ?? 2;
    const delayTimeBetweenTwoJobs = object.delay ?? 1;
    const attempts = object?.attempts ?? 3;
    const burgerQueue = new Bull("burger", redisOptions);

    burgerQueue.process(concurrency, async (payload, done) => {
      try {
        payload.log("Grill the patty");
        payload.progress(20);
        await sleep(sleepTime);

        // if (Math.random() > 0.25) {
        //   throw new Error("Toast got burnts");
        // }
        payload.log("Toast the bun");
        payload.progress(40);
        await sleep(sleepTime);

        payload.log("Add the toppings");
        payload.progress(60);
        await sleep(sleepTime);

        payload.log("Assemble the layers");
        payload.progress(80);
        await sleep(sleepTime);

        payload.log("Burger ready");
        payload.progress(100);
        await sleep(sleepTime);

        done();
      } catch (err: any) {
        done(err);
      }
    });

    const jobs = [...new Array(totalJobs)].map((_) => ({
      bun: "Bun",
      cheese: "cheese",
      toppings: ["tomato", "capsicum", "spinach", "chilli"],
    }));

    burgerQueue.on("completed", (job) => {
      console.log("Job done ", job.id);
    });

    jobs.forEach((job, i) =>
      burgerQueue.add(job, {
        jobId: i,
        attempts: 3,
      })
    );
    return {
      message: `Scheduled ${totalJobs} jobs.`,
    };
  }

  /**
   * Scheduling jobs with retry mechanisms
   * @param object
   * @param options
   * @returns
   */
  static async jobRetries(object: any, options: any) {
    const scheduledAt = 2 * 60 * 1000;
    const sleepTime: number = Math.floor(Math.random() * 10 * 1000);
    const totalJobs = object.totalJobs ?? 10;
    const concurrency = object.concurrency ?? 2;
    const retryAttempts = 6;

    const { redis } = config;
    const redisOptions = {
      redis,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    };
    const burgerQueue = new Bull("burger", redisOptions);
    burgerQueue.process(concurrency, async (payload, done) => {
      try {
        payload.log("Grill the patty");
        payload.progress(20);
        await sleep(sleepTime);

        // if (Math.random() > 0.25) {
        //   throw new Error("Toast got burnts");
        // }
        payload.log("Toast the bun");
        payload.progress(40);
        await sleep(sleepTime);

        payload.log("Add the toppings");
        payload.progress(60);
        await sleep(sleepTime);

        payload.log("Assemble the layers");
        payload.progress(80);
        await sleep(sleepTime);

        payload.log("Burger ready");
        payload.progress(100);
        await sleep(sleepTime);

        done();
      } catch (err: any) {
        done(err);
      }
    });

    const job = {
      bun: "Bun",
      cheese: "cheese",
      toppings: ["tomato", "capsicum", "spinach", "chilli"],
    };

    burgerQueue.on("completed", (job) => {
      console.log("Job done ", job.id);
    });

    burgerQueue.on("failed", (job) => {
      if (job.attemptsMade >= retryAttempts) {
        console.log(`Job ${job.id} has failed`);
      } else {
        console.log("Retrying job", job.id);
        job.retry();
      }
    });

    burgerQueue.add(job, { attempts: 3, delay: scheduledAt });

    return {
      message: `Scheduled ${totalJobs} jobs.`,
    };
  }

  /**
   * Killing a specific job
   * @param object
   * @param options
   * @returns
   */
  static async killJob(object: any, options: any) {
    const { redis } = config;
    const redisOptions = {
      redis,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    };
    const burgerQueue = new Bull("burger", redisOptions);
    const jobId = object.jobId;
    const job = await burgerQueue.getJob(jobId);
    if (job) {
      job.remove();
      return {
        message: "Job removal successfull",
      };
    }

    return {
      message: "NO job found",
    };
  }

  /**
   * Creating jobs based on priority queues
   * @param object
   * @param options
   * @returns
   */
  static async createPriorityBasedJobs(object: any, options: any) {
    const scheduledAt =
      new Date(object.scheduledAt).getTime() - new Date().getTime();
    const sleepTime: number = Math.floor(Math.random() * 10 * 1000);
    const totalJobs = object.totalJobs ?? 10;
    const concurrency = object.concurrency ?? 2;
    const retryAttempts = 6;

    const priority = object.priority;
    const { redis } = config;
    const redisOptions = {
      redis,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    };
    const burgerQueue = new Bull("burger", redisOptions);
    burgerQueue.process(concurrency, async (payload, done) => {
      try {
        payload.log("Grill the patty");
        console.log("Process job started ", payload.id);
        payload.progress(20);
        await sleep(sleepTime);

        // if (Math.random() > 0.25) {
        //   throw new Error("Toast got burnts");
        // }
        payload.log("Toast the bun");
        payload.progress(40);
        await sleep(sleepTime);

        payload.log("Add the toppings");
        payload.progress(60);
        await sleep(sleepTime);

        payload.log("Assemble the layers");
        payload.progress(80);
        await sleep(sleepTime);

        payload.log("Burger ready");
        payload.progress(100);
        await sleep(sleepTime);

        done();
      } catch (err: any) {
        done(err);
      }
    });

    const job = {
      bun: "Bun",
      cheese: "cheese",
      toppings: ["tomato", "capsicum", "spinach", "chilli"],
    };

    burgerQueue.on("completed", (job) => {
      console.log("Job done ", job.id);
    });

    burgerQueue.on("failed", (job) => {
      if (job.attemptsMade >= retryAttempts) {
        console.log(`Job ${job.id} has failed`);
      } else {
        console.log("Retrying job", job.id);
        job.retry();
      }
    });

    /**
     * Jobs won't be added to the queue if JobId is not unique
     */
    const myJob = await burgerQueue.add(job, {
      attempts: 3,
      delay: scheduledAt,
      priority: priority,
      jobId: `Job ${sleepTime} - ${priority}`,
    });

    return {
      message: `Scheduled delayed job with priority.`,
    };
  }

  /**
   * Scheduling the job and running on worker on another server
   * @param object
   * @param options
   * @returns
   */
  static async createForWorker(object: any, options: any) {
    const { redis } = config;
    const redisOptions = {
      redis,
    };

    /**
     * Initialising the queue
     */
    const burgerQueue = new Bull("burger", redisOptions);

    /**
     * Pushing a new job to the queue
     */
    burgerQueue.add(
      {
        bun: "Bun",
        cheese: "cheese",
        toppings: ["tomato", "capsicum", "spinach", "chilli"],
      },
      {
        delay: 5000,
        attempts: 3,
      }
    );

    return {
      message: "Task scheduled seconds",
    };
  }

  static async scheduleRecurringJobs(object: any, options: any) {
    const { redis } = config;
    const redisOptions = {
      redis,
    };

    /**
     * Initialising the queue
     */
    const burgerQueue = new Bull("burger", redisOptions);

    /**
     * Pushing a new job to the queue
     */
    burgerQueue.add(
      {
        bun: "Bun",
        cheese: "cheese",
        toppings: ["tomato", "capsicum", "spinach", "chilli"],
      },
      {
        jobId: "recurring-1",
        repeat: {
          cron: "* * * * *",
        },
        attempts: 3,
        backoff: 3,
        timeout: 60000,
      }
    );

    return {
      message: "Task scheduled seconds",
    };
  }

  static async removeRecurringJobs(object: any, options: any) {
    const { redis } = config;
    const redisOptions = {
      redis,
    };

    /**
     * Initialising the queue
     */
    const burgerQueue = new Bull("burger", redisOptions);

    const job = await burgerQueue.removeRepeatable({
      cron: "* * * * *",
      jobId: "recurring-1",
    });

    return {
      message: "Killed a repeatable job",
    };
  }
}
