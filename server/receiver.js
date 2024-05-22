const amqp = require('amqplib');

const receive = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const exchange = 'message_exchange';
    const routingKey = 'message_key';
    const queue = 'message_queue';

    await channel.assertExchange(exchange, 'direct', {
      durable: false
    });

    await channel.assertQueue(queue, {
      durable: false
    });

    await channel.bindQueue(queue, exchange, routingKey);

    console.log('Waiting for messages in queue:', queue);

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        console.log('Received:', msg.content.toString());
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Failed to receive messages', error);
  }
};

receive();

