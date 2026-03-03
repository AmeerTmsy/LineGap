import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const USER_A = "69a0125e1704eade1fc48b69";
const USER_B = "69a3dbf4f10e45623c9e7118";
const CHAT_ID = "69a3ded34d94e60a0b5981f0";

function App() {
  const [switchUser, setSwitchUser] = useState(false);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  const currentUserId = switchUser ? USER_B : USER_A;

  useEffect(() => {
    const newSocket = io("http://localhost:3000");

    newSocket.on("connect", () => {
      console.log("Connected:", newSocket.id);
      newSocket.emit("setup", { id: currentUserId });
      // join chat room
    });

    newSocket.on("typing", ({ userId }) => {
      if (userId !== currentUserId) {
        setTypingUser(userId);
        setIsTyping(true);
      }
    });

    newSocket.on("stop typing", () => {
      setIsTyping(false);
    });

    newSocket.on("new message", (message) => {
      console.log("🔥 SOCKET EVENT FIRED FOR USER:", currentUserId);
      console.log(message);
      if (message.chat._id === activeChat?._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [currentUserId]);

  useEffect(() => {
    if (!socket || !activeChat) return;
    socket.emit("join chat", activeChat._id);
  }, [activeChat, socket]);

  useEffect(() => {
    const fetchChats = async () => {
      const token = currentUserId === USER_A
        ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YTAxMjVlMTcwNGVhZGUxZmM0OGI2OSIsImlhdCI6MTc3MjU1ODIxMiwiZXhwIjoxNzczMTYzMDEyfQ.Oqb36Qm9vrJN5CqxKxOr8n9lDCMeeQKGL48gJqjzq14'
        : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YTNkYmY0ZjEwZTQ1NjIzYzllNzExOCIsImlhdCI6MTc3MjU1ODE0NywiZXhwIjoxNzczMTYyOTQ3fQ.uac-lyxRc3o2B9fM8U0b1ghERUoX1f5pqFD39uWXxH0'
      const response = await axios.get(
        "http://localhost:3000/api/chat",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChats(response.data);
      console.log(response)
    };

    fetchChats();
  }, [currentUserId]);

  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
      const token =
        currentUserId === USER_A
          ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YTAxMjVlMTcwNGVhZGUxZmM0OGI2OSIsImlhdCI6MTc3MjU1ODIxMiwiZXhwIjoxNzczMTYzMDEyfQ.Oqb36Qm9vrJN5CqxKxOr8n9lDCMeeQKGL48gJqjzq14'
          : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YTNkYmY0ZjEwZTQ1NjIzYzllNzExOCIsImlhdCI6MTc3MjU1ODE0NywiZXhwIjoxNzczMTYyOTQ3fQ.uac-lyxRc3o2B9fM8U0b1ghERUoX1f5pqFD39uWXxH0'
      const response = await axios.get(
        `http://localhost:3000/api/message/${activeChat._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(response.data);
    };

    fetchMessages();
  }, [activeChat, currentUserId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // const token = prompt("Paste JWT token for this user:");
    const token = currentUserId == '69a0125e1704eade1fc48b69' ?
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YTAxMjVlMTcwNGVhZGUxZmM0OGI2OSIsImlhdCI6MTc3MjQ5ODA0NCwiZXhwIjoxNzczMTAyODQ0fQ.4UrgGgiwWg99xzztTZ2QYijCwY1W4v8hSgPIdLXgLgY'
      :
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YTNkYmY0ZjEwZTQ1NjIzYzllNzExOCIsImlhdCI6MTc3MjUwMDI2MywiZXhwIjoxNzczMTA1MDYzfQ.XPsdc0rrB-fQk2ovWLNLTPJ-8dXsKJ3g7y3PxINBv2M'

    const response = await axios.post(
      "http://localhost:3000/api/message",
      {
        chatId: CHAT_ID,
        content: input,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response)
    setMessages((prev) => [...prev, response.data]);
    setInput("");
  };

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-1/3 border-r p-4">
        <button
          className="bg-gray-300 px-2 py-1 mb-4"
          onClick={() => setSwitchUser(!switchUser)}
        >
          Switch User
        </button>

        {chats.map((chat) => {
          const otherUser = chat.users.find(
            (u) => u._id !== currentUserId
          );

          return (
            <div
              key={chat._id}
              className={`p-2 cursor-pointer ${activeChat?._id === chat._id
                ? "bg-gray-200"
                : ""
                }`}
              onClick={() => setActiveChat(chat)}
            >
              {otherUser?.name}
            </div>
          );
        })}
      </div>

      {/* Chat Area */}
      <div className="w-2/3 p-4">
        {activeChat ? (
          <div>
            <h2 className="font-bold mb-4">
              Chat with{" "}
              {
                activeChat.users.find(
                  (u) => u._id !== currentUserId
                )?.name
              }
            </h2>

            {/* Messages will go here */}
            <div className="border h-80 overflow-y-auto p-2 mb-4">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`mb-2 ${msg.sender._id === currentUserId
                    ? "text-right"
                    : "text-left"
                    }`}
                >
                  <div className="inline-block bg-gray-200 px-3 py-1 rounded">
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>Select a chat</div>
        )}
      </div>
    </div>
  );
}

export default App;