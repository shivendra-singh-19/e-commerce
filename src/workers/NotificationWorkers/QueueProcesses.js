const Bull = require("bull");
const burgerQueue = new Bull("burgerQueue", {
  redis: {
    host: "localhost",
    port: 6379,
  },
});

const sleep = promisify(setTimeout);

burgerQueue.process(async (payload, done) => {
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
  } catch (err) {
    done(err);
  }
});
