const amqp = require("amqplib");

const post = async ({ msg }) => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const name = "notification";

    await channel.assertExchange(name, "fanout", { durable: false });

    await channel.publish(name, "", Buffer.from(msg));

    console.log(`Done: ${msg}`);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 2000);
  } catch (error) {
    console.log(error);
  }
};

const msg = process.argv.slice(2).join(" ") || "Hello World!";

post({ msg });
