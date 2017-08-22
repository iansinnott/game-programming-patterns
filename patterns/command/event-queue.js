/**
 * I'm not sure that this really has much to do with the command pattern, but I
 * wanted to implement a simple event queue that pulls and processes events at a
 * set interval.
 */

const createEventQueue = (pollTimeout = 300) => {
  const queue = [];

  let handler;

  const process = () => {
    console.log('Processing queue...');
    while (queue.length > 0) {
      const command = queue.pop();
      handler(command);
    }
  };

  return {
    push: (command) => queue.push(command),
    subscribe: (fn) => {
      handler = fn;
      const _ref = setInterval(process, pollTimeout);
      return () => clearInterval(_ref);
    },
  };
};

const sleep = (ms) => new Promise(resolve => {
  setTimeout(() => resolve(), ms);
});

const main = async () => {
  const queue = createEventQueue(800);

  const unsub = queue.subscribe(command => {
    console.log('COMMAND: ', command);
  });

  queue.push({ name: 'First' });
  queue.push({ name: 'Second' });
  queue.push({ name: 'Third' });

  await sleep(1200);

  queue.push({ name: 'yet' });
  queue.push({ name: 'another' });
  queue.push({ name: 'command' });

  await sleep(600);

  console.log('Unsubscribing...');
  unsub();
};

main();

