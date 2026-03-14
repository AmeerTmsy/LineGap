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
import { Toaster } from "react-hot-toast";

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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showSideBar, setShowSidebar] = useState(true)

  const { user, userToken, logout } = useAuth();
  const { chats, activeChat, setActiveChat, updateChatList, updateLatestMessage } = useChat();
  const { availableProfiles } = useAvailableProfiles();

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });


  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    console.log('wndow: ', windowWidth)
  }, [windowWidth]);



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
      new Audio('/sounds/notification-receive.mp3').play();
      updateLatestMessage(message)
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
      new Audio('/sounds/notification-send.mp3').play();
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
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: '',
          style: {
            fontSize: '13px',
            fontWeight: '300',
            padding: '5px 16px',
            borderRadius: '8px',
          },
        }}
      />
      <div style={{ ...((windowWidth < 750 && showSideBar) ? { width: '100%' } : (windowWidth < 750 && !showSideBar) ? { width: '0%', padding: 0 } : {}) }} className="w-1/3 h-full border-r p-4 flex flex-col overflow-hidden shadow-lg shadow-black z-10">
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
            setShowSidebar={setShowSidebar}
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
          ...((windowWidth < 750 && showSideBar) ? { width: '0', padding: 0 } : (windowWidth < 750 && !showSideBar) ? { width: '100%', padding: 0 } : {}),
        }}
        className="w-2/3 flex flex-col p-4 bg-gray-100">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="relative flex justify-between items-center bg-[#ffffffd9] px-3 py-4 rounded-md ">
              <h2 className="font-bold flex justify-center">
                {windowWidth < 750 && <span onClick={() => {
                  setShowSidebar(true);
                  setActiveChat(null);
                }} className="me-3 inline-block"><svg className="transform hover:-translate-x-1 transition-all duration-200 ease-in-out" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="currentColor" d="M7.94 13.06a1.5 1.5 0 0 1 0-2.12l5.656-5.658a1.5 1.5 0 1 1 2.121 2.122L11.122 12l4.596 4.596a1.5 1.5 0 1 1-2.12 2.122l-5.66-5.658Z" /></g></svg>
                </span>}
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
            }} className={`flex ${windowWidth < 750 && 'px-2 pb-2'}`}>
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
          <div className="w-full flex-1 min-h-0">
            {(windowWidth > 750 || !showSideBar) && <div className="w-full h-full flex flex-col justify-center items-center">
              <div className="flex flex-col gap-1 w-56">
                <div className="group bg-[#e6e6e6c9] hover:bg-[#e6e6e6e2] transition-colors duration-200 ease-in-out rounded-lg flex flex-col justify-center items-center py-3 shadow-2xl border border-[#1f1f1f62]">
                  <p>Select a chat</p>
                  <p>You are beautiful</p>
                  <p className="opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">Not so much</p>
                </div>
                <div className="flex justify-evenly gap-1">
                  <div className="bg-[#e6e6e6c9] hover:bg-[#e6e6e6e2] transition-colors duration-200 ease-in-out flex-1 rounded-lg flex justify-center p-2  shadow-2xl border border-[#1f1f1f62]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 64 64"><circle cx="32" cy="30" r="28" fill="#ffdd67" /><g fill="#ff717f"><ellipse cx="49.9" cy="21.5" opacity="0.8" rx="6.1" ry="8.4" transform="rotate(-75.001 49.952 21.545)" /><ellipse cx="12.3" cy="28.2" opacity="0.8" rx="8.4" ry="6.1" transform="rotate(-34.995 12.269 28.19)" /></g><path fill="#664e27" d="M26.7 18.2c-2.5-4.3-5.3-6.1-7.8-5.6c-2.5.4-4.6 3.1-5.4 8c-.1.5.9 1.2 1.3.6c1.3-2 3.1-3 5.1-3.3c2-.4 4 0 5.9 1.4c.5.3 1.2-.7.9-1.1m19.5-3.5c-2.5-4.2-5.3-6.1-7.8-5.6c-2.5.4-4.6 3.2-5.4 8c-.1.5.9 1.2 1.3.6c1.3-2 3.1-3 5.1-3.3c2-.4 4 0 5.9 1.4c.4.3 1.1-.6.9-1.1m-3.3 11.8c-6.3 6.3-14.3 7.7-22.4 3.9c-1-.5-1.6.7-.8 1.6c2.8 3.2 7.8 5.6 13.4 4.6s9.5-5 11-9c.5-.9-.4-1.8-1.2-1.1" /><path fill="#fff" d="M27.2 46.8s1.8-.6 1.1-3c-.7-2.5-6.9 0-10-1.2c0 0 2.5-.8 1.7-2.9c-.8-1.9-7.6-2.6-14.3 2.6S3.3 59.5 11.6 61c5.8 1 14.6.9 15.7-1.6c.9-2-1.9-2.7-1.9-2.7s3.5 0 3.5-2.7c0-1.6-1.3-1.6-1.3-1.6s2.9-.4 2.9-3.1c.1-2.3-3.3-2.5-3.3-2.5" /><path fill="#cccfd4" d="M28.4 46.9c2.2-1.5.3-5.1-2.4-4.7c-2.3.4-6.3.4-6.3.4s1.3-.5 1-2.2s-2.7-4.2-12.3-.3c-3.6 1.5-5.9 4.5-6.3 8.2c-.4 4 1.4 8.7 4.3 10.8c3.2 2.4 10.7 3.8 17.9 2.4c4.8-.9 4.3-4 2.3-4.5c3.3-.6 3.6-3.4 2-4.2c3.7-1.2 2.7-5.8-.2-5.9M25.8 52c-1.9.2-7 .6-7 .6s3.5.7 7.2.1c3.3-.5 3.1 2.8-1.5 3.4c-2.2.3-5.7.4-5.7.4s3.2.5 4.9.3c4.4-.6 3.9 2.7-.2 3.3c-7.3 1-13.2 0-16.1-2.1c-4.1-3-6.5-13 1.5-16.7c3.6-1.7 9.5-3.2 10.4-1.2c1.2 2.9-4.2 3.2-4.2 3.2s4.4.6 10.7-.1c1.7-.2 3 1.9.9 3.1c-1.8 1.1-7.9 1.5-7.9 1.5s3.3.1 7.9-.3c3.7-.3 4 3.9-.9 4.5" /><path fill="#fff" d="M36.8 46.8s-1.8-.6-1.1-3c.7-2.5 6.9 0 10-1.2c0 0-2.5-.8-1.7-2.9c.8-1.9 7.6-2.6 14.3 2.6s2.3 17.2-5.9 18.6c-5.8 1-14.6.9-15.7-1.6c-.9-2 1.9-2.7 1.9-2.7s-3.5 0-3.5-2.7c0-1.6 1.3-1.6 1.3-1.6s-2.9-.4-2.9-3.1c-.1-2.2 3.3-2.4 3.3-2.4" /><path fill="#cccfd4" d="M35.4 52.7c-1.5.8-1.2 3.6 2 4.2c-2 .5-2.5 3.6 2.3 4.5c7.3 1.4 14.7.1 17.9-2.4c2.8-2.1 4.7-6.8 4.3-10.8c-.4-3.7-2.7-6.7-6.3-8.2c-9.7-3.9-12-1.5-12.3.3c-.3 1.7 1 2.2 1 2.2s-4 0-6.3-.4c-2.7-.5-4.6 3.2-2.4 4.7c-2.9.2-3.9 4.8-.2 5.9m1.9-5.2c4.6.4 7.9.3 7.9.3s-6.1-.4-7.9-1.5c-2.1-1.2-.8-3.3.9-3.1c6.4.8 10.7.1 10.7.1s-5.4-.4-4.2-3.2c.9-2 6.8-.5 10.4 1.2c8 3.8 5.5 13.7 1.5 16.7c-2.8 2.1-8.8 3.2-16.1 2.1c-4.2-.6-4.7-3.9-.2-3.3c1.7.2 4.9-.3 4.9-.3s-3.5-.1-5.7-.4c-4.6-.6-4.8-3.9-1.5-3.4c3.6.5 7.2-.1 7.2-.1s-5.1-.3-7-.6c-4.9-.6-4.6-4.8-.9-4.5" /></svg>
                  </div>
                  <div className="bg-[#e6e6e6c9] hover:bg-[#e6e6e6e2] transition-colors duration-200 ease-in-out flex-1 rounded-lg flex justify-center p-2  shadow-2xl border border-[#1f1f1f62]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="18" fill="#ffec12" /><path fill="#664500" d="M18 21c-3.623 0-6.027-.422-9-1c-.679-.131-2 0-2 2c0 4 4.595 9 11 9c6.404 0 11-5 11-9c0-2-1.321-2.132-2-2c-2.973.578-5.377 1-9 1" /><path fill="#fff" d="M9 22s3 1 9 1s9-1 9-1s-2 4-9 4s-9-4-9-4" /><ellipse cx="12" cy="13.5" fill="#664500" rx="2.5" ry="3.5" /><ellipse cx="24" cy="13.5" fill="#664500" rx="2.5" ry="3.5" /></svg>
                  </div>
                </div>
              </div>
            </div>}
          </div>
        )}
      </div>
      <ChatPartnerProfile isOpen={isShowingChatPartner} onClose={() => setIsShowingChatPartner(false)} chatPartner={chatPartner} />
    </div>
  );
}

export default ChatPage;