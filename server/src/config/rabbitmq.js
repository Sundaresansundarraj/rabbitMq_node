const amqp = require('amqplib');

const connect = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const exchange = 'message_exchange';
    const routingKey = 'message_key';

    await channel.assertExchange(exchange, 'direct', {
      durable: false
    });

    return { connection, channel, exchange, routingKey };
  } catch (error) {
    console.error('Failed to connect to RabbitMQ', error);
  }
};

module.exports = { connect };



