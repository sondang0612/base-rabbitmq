const amqp = require("amqplib");

const sendMsg = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "hello";
    const msg = "Hello World";

    await channel.assertQueue(queue, {
      durable: true /* true: restart / tắt server queue vẫn còn lưu */,
    });
    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true /* true: restart / tắt server message vẫn còn lưu */,
      priority: 1 /* Queue nào có priority cao hơn thì dc consumer ưu tiên xử lí trước */,
    });

    console.log(`Sent: ${msg}`);
    setTimeout(() => connection.close(), 500);
  } catch (err) {
    console.error(err);
  }
};

sendMsg();
