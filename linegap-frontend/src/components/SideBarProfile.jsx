import React from 'react'

function SideBarProfile({ user, logout, isShowingSideChats }) {
    if (isShowingSideChats) return null
    console.log(user)
    return (
        <div className='flex-1 min-h-0 flex flex-col justify-between overflow-scroll'>
            <div>
                <h4 className='font-semibold'>SideBarProfile</h4>
                <div className='flex flex-col gap-1 text-gray-700 mt-5'>
                    <h6>{user.name}</h6>
                    <h6>{user.email}</h6>
                </div>
            </div>
            <div>
                <button
                    className="bg-red-100 text-red-500 px-3 py-1 rounded text-sm"
                    onClick={logout}
                >Logout</button>
            </div>
        </div>
    )
}

export default SideBarProfile