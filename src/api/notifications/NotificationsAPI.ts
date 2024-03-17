import { createClient } from "redis";
import {
  IProducerNotification,
  ProducerNotificationModel,
} from "../../Models/ProducerNotificationModel";
import { NotificationUtils } from "../../utils/NotificationUtils";
import { redisClient } from "../..";

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
}
