import {
  IProducerNotification,
  ProducerNotificationModel,
} from "../../Models/ProducerNotificationModel";
import { NotificationUtils } from "../../utils/NotificationUtils";

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
}
