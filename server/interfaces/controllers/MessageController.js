const GetMessages = require("../../application/usecases/message/GetMessages");
const SendMessage = require("../../application/usecases/message/SendMessage");
const { messageRepository, chatRepository } = require("../../infrastructure/container");
const { io } = require('../../index')

class MessageController {
  async sendMessage(req, res) {
    try {
      const sendMessage = new SendMessage(messageRepository, chatRepository);

      const message = await sendMessage.execute({
        senderId: req.user.id,
        chatId: req.body.chatId,
        content: req.body.content,
      });

      // console.log("Emitting to users:", String(message.chat.users));

      // Emit to all users in the chat except sender
      message.chat.users.forEach((userId) => {
        const userIdStr = userId.toString();
        if (userIdStr === req.user.id.toString()) return;
        io.to(userIdStr).emit("new message", message);
      });
      
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  async getMessages(req, res) {
    try {
        const getMessages = new GetMessages(messageRepository);

        const messages = await getMessages.execute(req.params.chatId);

        res.status(200).json(messages);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new MessageController();