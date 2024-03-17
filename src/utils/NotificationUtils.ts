import * as _ from "lodash";
import path from "node:path";
import * as tsNode from "ts-node";

import { Worker } from "node:worker_threads";
import { IProducerNotification } from "../Models/ProducerNotificationModel";

tsNode.register();

export class NotificationUtils {
  static async scheduleNotification(notification: IProducerNotification) {}

  static cpuIntensiveTask(object: any, options: any) {
    const cpus = object.cpus;
    const jobs = Array.from({ length: 100 }, () => 1e9);
    const jobChunk = this.chunkify(jobs, cpus);

    jobChunk.forEach((data, i) => {
      const tsFilePath = path.resolve(
        __dirname,
        "../workers/NotificationWorkers/CpuBenchWorker.ts"
      );
      const worker = new Worker(tsFilePath);
    });
    return {
      jobChunk: jobChunk.length,
    };
  }

  static chunkify(jobs: any, cpu: number) {
    const jobChunkSize = jobs.length / cpu;
    const chunks = _.chunk(jobs, jobChunkSize);
    return chunks;
  }
}
