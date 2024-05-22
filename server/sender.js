const amqp = require('amqplib');

const send = async (message) => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const exchange = 'message_exchange';
    const routingKey = 'message_key';

    await channel.assertExchange(exchange, 'direct', {
      durable: false
    });

    channel.publish(exchange, routingKey, Buffer.from(message));
    console.log("Sent:", message);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error('Failed to send message', error);
  }
};

send( "vada mapla");

