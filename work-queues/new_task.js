const amqp = require("amqplib");

const sendMsg = async ({ msg }) => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "task_queue";

    await channel.assertQueue(queue, {
      durable: true,
    });
    channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });

    console.log(`Sent: ${msg}`);
    setTimeout(() => connection.close(), 500);
  } catch (err) {
    console.error(err);
  }
};
const msg = process.argv.slice(2).join(" ") || "Hello World!";

sendMsg({ msg });
