import axios from 'axios';
import React, { useEffect, useRef } from 'react'
import { serverAPI } from '../services/apis';
import { useAuth } from '../context/Authcontext';
import toast, { Toaster } from 'react-hot-toast';
import { useChat } from '../context/ChatContext';

function AddNewChat({ isOpen, onClose, availableProfiles }) {
    const panelRef = useRef();
    const { userToken } = useAuth();

    const { updateChatList } = useChat();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) onclick();
        }
        if (isOpen) document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleCreateChat = async (profile) => {
        try {
            const url = `${serverAPI}/chat`
            const headers = { Authorization: `Bearer ${userToken}` }
            const response = await axios.post(url, { userId: profile._id }, { headers })
            console.log('adding new chat:', response)
            if (response?.status == 200) {
                updateChatList(response?.data)
                onClose()
                toast.success('Chat created with: ', profile.name)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div
            ref={panelRef}
            className={`absolute inset-1 h-full bg-white ${isOpen ? 'shadow-2xl' : ''}
                w-full transform transition-transform duration-300 ease-in-out
                ${isOpen ? '-translate-x-1' : '-translate-x-full'}`}
        >
            <div className="flex items-center justify-between px-1 py-2 ">
                <h3 className="text-md font-normal text-[#351060] text-center w-full sm:w-auto">Available Profiles</h3>
            </div>

            <div className="py-2 space-y-0 overflow-y-auto h-[calc(100%-140px)]">
                {availableProfiles?.map((profile) => (
                    <div key={profile._id} onClick={() => handleCreateChat(profile)} className='py-1 px-2 rounded-md hover:bg-gray-100 transition-colors duration-300 ease-in-out flex justify-between items-center group cursor-pointer'>
                        <div>
                            <p>{profile?.name}</p>
                            <p className="text-sm text-gray-500">{profile?.email}</p>
                        </div>
                        <button className="relative w-8 h-8 flex items-center justify-center overflow-hidden">
                            {/* Plus Icon: Rotates and fades out on hover */}
                            <svg
                                className="absolute transition-all duration-500 ease-in-out transform group-hover:rotate-90 group-hover:opacity-0"
                                xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
                                <path fill="currentColor" d="M16 3a1 1 0 0 1 1 1v11h11a1 1 0 1 1 0 2H17v11a1 1 0 1 1-2 0V17H4a1 1 0 1 1 0-2h11V4a1 1 0 0 1 1-1" />
                            </svg>
                            {/* Arrow Icon: Starts rotated/invisible, then slides/fades in */}
                            <svg
                                className="absolute transition-all duration-500 ease-in-out transform -rotate-90 opacity-0 group-hover:rotate-0 group-hover:opacity-100"
                                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024">
                                <path fill="currentColor" d="M754.8 480H160a32 32 0 1 0 0 64h594.8L521.3 777.3a32 32 0 0 0 45.4 45.4l288-288a32 32 0 0 0 0-45.4l-288-288a32 32 0 1 0-45.4 45.4z" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AddNewChat