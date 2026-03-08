import React, { useEffect, useRef } from 'react'

function ChatPartnerProfile({ isOpen, onClose, chatPartner }) {
    // if(!isOpen) return null // can't be used because it is effecting the animation while mount/unmount
    const panelRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    return (
        <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
            <div
                ref={panelRef}
                className={`absolute right-0 top-0 h-full bg-white shadow-2xl 
                w-full sm:w-[80%] md:w-[40%]
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-300">
                    <h3 className="text-lg font-semibold text-[#351060] text-center w-full sm:w-auto">
                        Chat Partner Profile
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl transition"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-5 overflow-y-auto h-[calc(100%-140px)]">
                    <div className='p-4 sm:p-0 shadow-sm sm:shadow-none rounded-2xl sm:rounded-none hidden sm:block'>
                        <p>{chatPartner?.name}</p>
                        <p className="text-sm text-gray-500">{chatPartner?.email}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatPartnerProfile