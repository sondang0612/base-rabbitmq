const amqp = require("amqplib");

const receiveMsg = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "hello";

    await channel.assertQueue(queue, { durable: true });
    console.log(`Waiting for messages in ${queue}`);

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        console.log(`Received: ${msg.content.toString()}`);
        channel.ack(msg); // khi xử lí xong gọi hàm này để rabbitmq biết là worker này xử lí xong
      }
    });
  } catch (err) {
    console.error(err);
  }
};

receiveMsg();
