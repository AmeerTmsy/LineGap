import React from 'react'

function SidebarChats({ user, chats, activeChat, setActiveChat, isShowingSideChats }) {
    if (!isShowingSideChats) return null;

    function formatChatTime(dateString) {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();

        // Create "Midnight" markers for accurate day boundaries
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfYesterday = new Date(startOfToday);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);

        // 1. If it's TODAY: Return Time (e.g., 02:09 PM)
        if (date >= startOfToday) {
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        }
        // 2. If it's YESTERDAY: Return "Yesterday"
        if (date >= startOfYesterday) { return "Yesterday" }
        // 3. If within the LAST 7 DAYS: Return Day Name (e.g., Monday)
        const diffInMs = startOfToday - date;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        if (diffInDays < 7) { return date.toLocaleDateString('en-US', { weekday: 'long' }) }
        // 4. OTHERWISE: Return Date (e.g., 03/05/2026)
        return date.toLocaleDateString('en-GB'); // Use 'en-US' for MM/DD/YYYY
    }

    return (
        <div className="flex-1 min-h-0 overflow-y-auto">
            {chats?.map((chat) => {
                const otherUser = {
                    user: chat?.users?.find((u) => u._id !== user.id),
                    content: chat?.latestMessage?.content?.length > 15
                        ? chat?.latestMessage?.content?.substring(0, 15) + "..."
                        : chat?.latestMessage?.content,
                    time: chat?.latestMessage?.updatedAt ? formatChatTime(chat?.latestMessage?.createdAt) : ""
                }

                return (
                    <div key={chat._id} onClick={() => setActiveChat(chat)}
                        className={`p-2 cursor-pointer ${activeChat?._id === chat._id ? "bg-gray-200" : ""}`}
                    >
                        <h6>{otherUser?.user?.name}</h6>
                        <div className="text-sm text-gray-600 flex justify-between w-full">
                            <p>{otherUser?.content}</p>
                            <p>{otherUser?.time}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default SidebarChats