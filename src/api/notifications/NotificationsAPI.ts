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

  static async testBullQueue(object: any, options: any) {
    const { redis } = config;
    const redisOptions = {
      redis,
    };

    const burgerQueue = new Bull("burger", redisOptions);

    burgerQueue.process((payload, done) => {
      console.log("Preparing burger....!");
      setTimeout(() => {
        console.log("Burger is ready...!");
        done();
      }, 10000);
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

  static async testBullQueueTest1(object: any, options: any) {
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

  static async testBullQueueTest2(object: any, options: any) {
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

    // burgerQueue.on("completed", (job) => {
    //   console.log(`${job.id} completed`);
    // });

    // burgerQueue.on("failed", (job) => {
    //   console.log(`${job.id} failed`);
    // });

    return {
      message: `Scheduled ${totalJobs} jobs.`,
    };
  }

  static async testBullQueueTest3(object: any, options: any) {
    const { redis } = config;
    const redisOptions = {
      redis,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    };

    const scheduledAt =
      new Date(object.scheduledAt).getTime() - new Date().getTime();
    const sleepTime = object.sleepTime * 1000 ?? 2000;
    const totalJobs = object.totalJobs ?? 10;
    const concurrency = object.concurrency ?? 2;
    const burgerQueue = new Bull("burger", redisOptions);

    burgerQueue.clean(1000, "delayed");

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

    const jobs = [...new Array(totalJobs)].map((_) => job);

    burgerQueue.on("completed", (job) => {
      console.log("Job done ", job.id);
    });

    burgerQueue.add(job, { attempts: 3, delay: scheduledAt });

    return {
      message: `Scheduled ${totalJobs} jobs.`,
    };
  }
}
