const Message = require('../models/message');

const saveMessage = async (content) => {
  if (!content) {
    throw new Error('Content is required');
  }

  const message = new Message({ content });
  await message.save();
};

module.exports = { saveMessage };


