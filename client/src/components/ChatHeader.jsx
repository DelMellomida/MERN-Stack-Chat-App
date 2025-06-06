import React from 'react'
import { X, UserMinus, Loader2 } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const { removeFriend, isRemovingFriend } = useUserStore();

    const handleRemoveFriend = () => {
        if (window.confirm(`Remove ${selectedUser.fullName} from your friends?`)) {
            removeFriend(selectedUser._id);
            setSelectedUser(null);
        }
    };

    return (
        <div className='p-2.5 border-b border-base-300'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <div className='avatar'>
                        <div className='size-10 rounded-full relative'>
                            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
                        </div>
                    </div>
                    <div>
                        <h3 className='font-medium'>{selectedUser.fullName}</h3>
                        <p className='text-sm text-base-content/70'>
                            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRemoveFriend}
                        disabled={isRemovingFriend}
                        className={`
                            flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium
                            bg-error/10 text-error hover:bg-error/20 transition-all
                            disabled:opacity-60 disabled:cursor-not-allowed
                        `}
                        title="Remove Friend"
                    >
                        {isRemovingFriend ? (
                            <>
                                <Loader2 className="animate-spin w-4 h-4" />
                                Removing...
                            </>
                        ) : (
                            <>
                                <UserMinus className="w-4 h-4" />
                                Remove
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => setSelectedUser(null)}
                        className="ml-1 p-2 rounded-full hover:bg-base-200 transition"
                        title="Close chat"
                    >
                        <X />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatHeader