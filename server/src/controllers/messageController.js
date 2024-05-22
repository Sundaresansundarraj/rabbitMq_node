const { connect } = require('../config/rabbitmq');
const { saveMessage } = require('../services/messageService');

const sendMessage = async (req, res) => {
  const { content } = req.body;
  const { channel, exchange, routingKey } = await connect();

  channel.publish(exchange, routingKey, Buffer.from(content));
  console.log("Message sent to exchange with routing key:", content);

  res.status(200).send('Message sent to queue');
};

const receiveMessage = async () => {
  const { channel, exchange, routingKey } = await connect();
  const queue = 'message_queue';

  await channel.assertQueue(queue, {
    durable: false
  });

  await channel.bindQueue(queue, exchange, routingKey);

  console.log('Waiting for messages in queue:', queue);

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const content = msg.content.toString();
      console.log('Received message:', content);
      try {
        await saveMessage(content);
        channel.ack(msg);
      } catch (error) {
        console.error('Failed to save message:', error.message);
      }
    }
  });
};

const getMessage = async (req, res) => {
  try {
    const { channel } = await connect();
    const queue = 'message_queue';

    await channel.assertQueue(queue, {
      durable: false
    });

    const msg = await channel.get(queue, { noAck: false });

    if (msg) {
      const content = msg.content.toString();
      console.log('Received message:', content);
      try {
        await saveMessage(content);
        channel.ack(msg);
        res.status(200).json({ message: content });
      } catch (error) {
        console.error('Failed to save message:', error.message);
        res.status(500).send('Failed to save message');
      }
    } else {
      res.status(200).json({ message: 'Queue is empty' });
    }
  } catch (error) {
    console.error('Failed to get message', error);
    res.status(500).send('Failed to get message');
  }
};

module.exports = { sendMessage, receiveMessage, getMessage };






