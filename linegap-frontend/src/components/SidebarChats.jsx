import React from 'react'
import AddNewChat from './AddNewChat';
import { formatChatTime } from '../util/utilities';

function SidebarChats({ user, chats, activeChat, setActiveChat, isShowingSideChats, setIsShowingAddNewChat, isOpen, availableProfiles, setShowSidebar }) {
    if (!isShowingSideChats) return null;

    return (
        <div className="flex-1 min-h-0 overflow-y-auto relative">
            <AddNewChat isOpen={isOpen} onClose={()=>setIsShowingAddNewChat(false)} availableProfiles={availableProfiles} />
            <div className='pt-2'>
                {chats?.length > 0 ?
                chats?.map((chat) => {
                    const otherUser = {
                        user: chat?.users?.find((u) => u._id !== user.id),
                        content: chat?.latestMessage?.content?.length > 15
                            ? chat?.latestMessage?.content?.substring(0, 15) + "..."
                            : chat?.latestMessage?.content,
                        time: chat?.latestMessage?.updatedAt ? formatChatTime(chat?.latestMessage?.createdAt) : ""
                    }

                    return (
                        <div key={chat._id} onClick={() => {
                            setActiveChat(chat)
                            setShowSidebar(false)
                        }}
                            className={`p-2 mt-0 cursor-pointer ${activeChat?._id === chat._id ? "bg-gray-200" : ""}  hover:bg-gray-100 transition-colors duration-300 ease-in-out`}
                        >
                            <h6>{otherUser?.user?.name}</h6>
                            <div className="text-sm text-gray-600 flex justify-between w-full">
                                <p>{otherUser?.content}</p>
                                <p>{otherUser?.time}</p>
                            </div>
                        </div>
                    );
                })
                :
                <div className="flex justify-center items-center mt-5">
                    <p className='text-center'>Looks You haven't created any chats.<br />Click add chat button on the top.</p>
                </div>
            }
            </div>
        </div>
    )
}

export default SidebarChats