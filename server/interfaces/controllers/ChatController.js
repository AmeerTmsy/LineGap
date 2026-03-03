const CreateChat = require("../../application/usecases/chat/CreateChat");
const GetUserChats = require("../../application/usecases/chat/GetUserChats");
const { chatRepository } = require("../../infrastructure/container");

class ChatController {
    async createChat(req, res) {
        try {
            const createChat = new CreateChat(chatRepository);

            const chat = await createChat.execute({
                currentUserId: req.user.id,
                targetUserId: req.body.userId,
            });

            res.status(200).json(chat);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async getChats(req, res) {
        try {
            const getUserChats = new GetUserChats(chatRepository);
            
            const chats = await getUserChats.execute(req.user.id);

            res.status(200).json(chats);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new ChatController();