import { use, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useAuth } from "../context/Authcontext";
import { serverAPI, serverAPISocket } from "../services/apis";
import SideBarProfile from "../components/SideBarProfile";
import ChatPartnerProfile from "../components/ChatPartnerProfile";
import SidebarChats from "../components/SidebarChats";
import { useChat } from "../context/ChatContext";
import { getTime } from "../util/utilities";
import { useAvailableProfiles } from "../context/AvailableProfileContext";

function ChatPage() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [isShowingSideChats, setIsShowingSideChats] = useState(true);
  const [isShowingChatPartner, setIsShowingChatPartner] = useState(false);
  const [chatPartner, setChatPartner] = useState(null);
  const [isShowingAddNewChat, setIsShowingAddNewChat] = useState(false);

  const { user, userToken, logout } = useAuth();
  const { chats, activeChat, setActiveChat, updateChatList, updateLatestMessage } = useChat();
  const { availableProfiles } = useAvailableProfiles();

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (!user?.id) return;
    const newSocket = io(serverAPISocket);

    newSocket.on("connect", () => {
      // console.log("Connected:", newSocket.id);
      newSocket.emit("setup", { id: user.id });
    });
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [user?.id]);

  useEffect(() => {
    if (!socket) return;
    const handleTyping = ({ userId }) => {
      if (userId !== user?.id) {
        setTypingUser(userId);
        setIsTyping(true);
      }
    };
    const handleStopTyping = () => setIsTyping(false)
    const handleNewMessage = (message) => {
      // console.log("🔥 SOCKET EVENT FIRED FOR USER:", user?.id);
      updateLatestMessage(message)
      // console.log('message: ', message)
      setMessages((prev) => {
        if (!activeChat) return prev;
        if (message.chat._id !== activeChat._id) return prev;
        return [...prev, message];
      });
    };

    socket.on("typing", handleTyping);
    socket.on("stop typing", handleStopTyping);
    socket.on("new message", handleNewMessage);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop typing", handleStopTyping);
      socket.off("new message", handleNewMessage);
    };
  }, [socket, activeChat, user?.id]);

  useEffect(() => {
    if (!socket || !activeChat) return;
    socket.emit("join chat", activeChat._id);
  }, [activeChat, socket]);

  useEffect(() => {
    const fetchChatPartnerData = async (id) => {
      try {
        const response = await axios.get(
          `${serverAPI}/auth/user/${id}`,
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        // console.log('chat parner: ', response)
        if (response?.status == 200) {
          setChatPartner(response?.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    if (!activeChat?.isGroupChat && activeChat) {
      const id = activeChat?.users?.find((u) => u._id !== user.id)._id
      fetchChatPartnerData(id)
    }
  }, [activeChat]);

  useEffect(() => {
    if (!activeChat) return;
    const fetchMessages = async () => {
      const response = await axios.get(
        `${serverAPI}/message/${activeChat._id}`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      setMessages(response?.data);
    };

    fetchMessages();
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    try {
      if (!input.trim()) return;
      const payload = { chatId: activeChat._id, content: input }
      const headers = { Authorization: `Bearer ${userToken}` }
      const response = await axios.post(`${serverAPI}/message`, payload, { headers });
      // console.log("Message res: ", response)
      if (response?.status == 201) {
        const newMessage = response?.data
        updateLatestMessage(response?.data)
        setMessages((prev) => [...prev, response?.data]);
        setInput("");
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-1/3 h-full border-r p-4 flex flex-col overflow-hidden shadow-lg shadow-black z-10">
        <div className={`flex-shrink-0 flex justify-between gap-2 items-center mb-0 pb-2 border-b`}>
          <div className="flex gap-2 items-center">
            <span onClick={() => {
              if (isShowingAddNewChat) setIsShowingAddNewChat(false)
              setIsShowingSideChats(!isShowingSideChats)
            }} className="cursor-pointer bg-gray-200 w-10 h-10 flex justify-center items-center rounded-full">
              {isShowingSideChats ?
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0m0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5z" clipRule="evenodd" /></svg>
                :
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12c0-3.771 0-5.657-1.172-6.828S15.771 4 12 4S6.343 4 5.172 5.172S4 8.229 4 12v6c0 .943 0 1.414.293 1.707S5.057 20 6 20h6c3.771 0 5.657 0 6.828-1.172S20 15.771 20 12Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 10h6m-6 4h3" /></g></svg>
              }
            </span>
            {isShowingSideChats ? <span>Chats</span> : <span>Profile</span>}
          </div>
          <span className="cursor-pointer w-10 h-10 flex justify-center items-center">
            {isShowingSideChats &&
              (!isShowingAddNewChat ?
                <svg onClick={() => setIsShowingAddNewChat(true)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4C8.229 4 6.343 4 5.172 5.172S4 8.229 4 12v6c0 .943 0 1.414.293 1.707S5.057 20 6 20h6c3.771 0 5.657 0 6.828-1.172S20 15.771 20 12" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 10h6m-6 4h3m7-6V2m-3 3h6" /></g></svg>
                :
                <svg onClick={() => setIsShowingAddNewChat(false)} className="text-black hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeDasharray="12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12l7 7M12 12l-7 -7M12 12l-7 7M12 12l7 -7"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="12;0" /></path></svg>
              )
            }
          </span>
        </div>
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <SidebarChats
            user={user}
            chats={chats}
            activeChat={activeChat}
            setActiveChat={setActiveChat}
            isShowingSideChats={isShowingSideChats}
            setIsShowingAddNewChat={setIsShowingAddNewChat}
            isOpen={isShowingAddNewChat}
            availableProfiles={availableProfiles}
          />
          <SideBarProfile user={user} logout={logout} isShowingSideChats={isShowingSideChats} />
        </div>
      </div>

      {/* Chat Area */}
      <div
        style={{
          backgroundImage: `url("chatbg.jpg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
          backgroundRepeat: 'no-repeat',
          height: '100vh',
        }}
        className="w-2/3 flex flex-col p-4 bg-gray-100">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="relative flex justify-between items-center bg-[#ffffffd9] px-3 py-4 rounded-md ">
              <h2 className="font-bold">
                {activeChat.isGroupChat ? activeChat.chatName : 'Chating with ' + activeChat.users.find((u) => u._id !== user.id)?.name}
              </h2>
              <div className="cursor-pointer text-black hover:pe-1 transition-all duration-300 ease-in-out" onClick={() => setIsShowingChatPartner(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokelLinejoin="round" strokeWidth="2" d="M12 17h7M5 12h14M5 7h14" /></svg>
              </div>
              {isTyping && (
                <div className="text-sm text-gray-500 hover:text-gray-900 mb-2 absolute -bottom-2">
                  {activeChat.users.find((u) => u._id === typingUser)?.name} is typing...
                </div>
              )}
            </div>
            {/* Messages */}
            <div className=" flex-1 overflow-y-auto p-2 mb-4 rounded-lg">
              {messages.map((msg) => {
                const isMe = msg.sender._id === user.id;

                return (
                  <div
                    key={msg._id}
                    className={`mb-4 flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`relative max-w-xs p-3 border border-gray-400 shadow-sm 
                     ${isMe
                        ? "bg-green-100 rounded-xl rounded-tr-none mr-2" // Your message styles
                        : "bg-white rounded-xl rounded-tl-none ml-2"    // Their message styles
                      }`}
                    >
                      {/* --- Outer Border Triangle --- */}
                      <div
                        className={`absolute top-[-1.1px] w-0 h-0 border-t-[12px] border-t-gray-400 
                          ${isMe
                            ? "-right-[9px] border-r-[10px] border-r-transparent"
                            : "-left-[9px] border-l-[10px] border-l-transparent"
                          }`}
                      />

                      {/* --- Inner Fill Triangle (Matches BG color) --- */}
                      <div
                        className={`absolute top-[0px] w-0 h-0 border-t-[10px] 
                          ${isMe
                            ? "border-t-green-50 -right-[8px] border-r-[9px] border-r-transparent"
                            : "border-t-white -left-[8px] border-l-[9px] border-l-transparent"
                          }`}
                      />

                      {/* Content Layout */}
                      <div className="flex gap-2 items-end">
                        <p className="text-sm text-gray-800 leading-relaxed">
                          {msg.content}
                        </p>
                        <span className="text-[10px] text-gray-400 uppercase whitespace-nowrap mb-[-2px]">
                          {getTime(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={(e) => {
              e.preventDefault();
              sendMessage()
            }} onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }} className="flex">
              <input
                className="flex-1 border border-gray-400 px-4 py-2 rounded-full"
                placeholder="Send your message..."
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (!socket || !activeChat) return;
                  socket.emit("typing", activeChat._id);
                  setTimeout(() => {
                    socket.emit("stop typing", activeChat._id);
                  }, 3000);
                }}
              />
              <button
                className={`${input.trim() == '' ? 'bg-blue-300' : 'bg-blue-500'} text-white px-[1.5em] ms-1 rounded-full`}
                type="submit"
                disabled={!input.trim()}
              ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.2" d="m6.998 10.247l.435.76c.277.485.415.727.415.993s-.138.508-.415.992l-.435.761c-1.238 2.167-1.857 3.25-1.375 3.788c.483.537 1.627.037 3.913-.963l6.276-2.746c1.795-.785 2.693-1.178 2.693-1.832s-.898-1.047-2.693-1.832L9.536 7.422c-2.286-1-3.43-1.5-3.913-.963s.137 1.62 1.375 3.788Z" /></svg></button>
            </form>
          </>
        ) : (
          <div>Select a chat</div>
        )}
      </div>
      <ChatPartnerProfile isOpen={isShowingChatPartner} onClose={() => setIsShowingChatPartner(false)} chatPartner={chatPartner} />
    </div>
  );
}

export default ChatPage;