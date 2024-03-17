const { parentPort } = require("worker_threads");

parentPort.on("message", (job) => {
  console.log(typeof job);
  let count = 0;

  for (let i = 0; i < Object.keys(job).length; i++) {
    for (let j = 0; j < Object.keys(job).length; j++) {}
    count++;
  }
  console.log("Job size processed: ", count);
  parentPort.postMessage("Done");
});
