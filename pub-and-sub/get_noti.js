const amqp = require("amqplib");

const getNoti = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const name = "notification";

    await channel.assertExchange(name, "fanout", { durable: false });
    const { queue } = await channel.assertQueue("", {
      exclusive: true /* true thì khi consumer đóng kết nói sẽ tự remove khỏi queue */,
      autoDelete: true /* true thì queue tự động xóa khi ko có consumer nào */,
      arguments: {
        "x-dead-letter-exchange": "dlx_exchange", // chuyển vào queue khác để xử lí
        "x-message-ttl": 5000, // message hết hạn sau 5s sẽ bị chuyển vào DLX
      },
    });

    console.log(`queue name: ${queue}`);

    await channel.bindQueue(queue, name, "");

    await channel.consume(
      queue,
      (msg) => {
        console.log(`message: ${msg.content.toString()}`);
      },
      { noAck: true }
    );
  } catch (error) {
    console.log(error);
  }
};

getNoti();
