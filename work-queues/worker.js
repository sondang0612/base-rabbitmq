const amqp = require("amqplib");

const reciveMessage = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "task_queue";

    await channel.assertQueue(queue, {
      durable: true,
    });

    channel.prefetch(1); // 1 worker chỉ thực thi 1 message, khi nào nó xong và gọi .ack lên server hoặc noAck true thì worker mới nhận message khác từ server để xử lí

    channel.consume(
      queue,
      (msg) => {
        const secs = msg.content.toString().split(".").length - 1;
        console.log(" [x] Received %s", msg.content.toString());
        setTimeout(function () {
          console.log(" [x] Done");
          //channel.ack(msg);
        }, secs * 1000);
      },

      { noAck: true }
    );
  } catch (err) {
    console.error(err);
  }
};

reciveMessage();
