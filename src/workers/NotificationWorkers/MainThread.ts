// main.ts

import { Worker } from "node:worker_threads";
import * as path from "path";

export class MainThread {
  constructor(data: any) {}

  static async runWorkers(data: any): Promise<number> {
    const tick = performance.now();

    // Create a new worker
    const worker = new Worker(path.resolve(__dirname, "CpuBenchWorker.js"));

    // Send data to the worker
    worker.postMessage(data);

    return new Promise((resolve) => {
      // Listen for messages from the worker
      worker.on("message", () => {
        const totalTime = performance.now() - tick;
        console.log(`Worker completed in ${totalTime}`);
        resolve(totalTime);
      });
    });
  }
}
