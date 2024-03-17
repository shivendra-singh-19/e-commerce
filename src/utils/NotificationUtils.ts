import * as _ from "lodash";
import path from "node:path";
import * as tsNode from "ts-node";

import { Worker } from "node:worker_threads";
import { IProducerNotification } from "../Models/ProducerNotificationModel";
import { MainThread } from "../workers/NotificationWorkers/MainThread";

tsNode.register();

export class NotificationUtils {
  /**
   * Using rabbitmq
   * @param notification
   */
  static async scheduleNotification(notification: IProducerNotification) {}

  static async cpuIntensiveTask(object: any, options: any) {
    //When using high numbers we can see the effect of this worker running
    //But for lower numbers we don't see this effect because of the overheads of the worker threads managements
    const jobs = Array.from({ length: 2000 }, () => 1e9);
    const cpus = jobs?.length >= 1000 ? 4 : 1;
    const jobChunk = this.chunkify(jobs, cpus);

    const totalTimePromises = jobChunk.map((data, i) => {
      return MainThread.runWorkers(data);
    });

    const totalTimes = await Promise.all(totalTimePromises);
    let final = 0;
    for (let i = 0; i < totalTimes.length; i++) {
      final = final + totalTimes[i];
    }

    return {
      jobChunk: jobChunk.length,
      totalTime: final,
    };
  }

  static chunkify(jobs: any, cpu: number) {
    const jobChunkSize = jobs.length / cpu;
    const chunks = _.chunk(jobs, jobChunkSize);
    return chunks;
  }
}
