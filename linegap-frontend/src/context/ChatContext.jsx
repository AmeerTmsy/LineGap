import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { serverAPI } from "../services/apis";
import { useAuth } from "./Authcontext";


const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { userToken } = useAuth();
    const [chats, setChats] = useState(null)
    const [activeChat, setActiveChat] = useState(null)

    useEffect(() => {
        // console.log('context fetching chat data')
        const fetchChats = async () => {
            const response = await axios.get(
                `${serverAPI}/chat`,
                { headers: { Authorization: `Bearer ${userToken}` } }
            );
            setChats(response?.data);
            // console.log("Chates from chat provider: ", response)
        };

        if (userToken) fetchChats();
    }, [userToken])

    const updateChatList = (newChat) => {
        setChats((prevChats) => [newChat, ...prevChats])
        setActiveChat(newChat);
    }
    const updateLatestMessage = (newMessage) => {
        setChats(prev => {
            return prev.map((chat) => {
                if (chat._id == newMessage.chat._id) {
                    return {
                        ...chat, latestMessage: {
                            chat: newMessage.chat._id,
                            content: newMessage.content,
                            createdAt: newMessage.createdAt,
                            sender: newMessage.sender._id,
                            updatedAt: newMessage.updatedAt,
                            _id: newMessage._id,
                        }
                    }
                }
                return chat
            })
        })
    }

    return (
        <ChatContext.Provider value={{
            chats,
            activeChat,
            setActiveChat,
            updateChatList,
            updateLatestMessage
        }} >{children}</ChatContext.Provider>
    )
}

export const useChat = () => useContext(ChatContext)