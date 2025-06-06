import React, { useEffect, useState } from 'react'
import { useUserStore } from '../store/useUserStore'
import UserSkeleton from './skeletons/UserSkeleton'
import { UserPlus, Check, Search, Users, Mail } from 'lucide-react'

const UsersContainer = () => {
    const { loadUsers, users, isLoadingUsers, addFriend, friendList, isAddingFriend } = useUserStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [addingStates, setAddingStates] = useState({});

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddFriend = async (userId) => {
        setAddingStates(prev => ({ ...prev, [userId]: true }));
        try {
            await addFriend(userId);
            setTimeout(() => {
                setAddingStates(prev => ({ ...prev, [userId]: false }));
            }, 500);
        } catch (error) {
            setAddingStates(prev => ({ ...prev, [userId]: false }));
        }
    };

    const isUserAdding = (userId) => addingStates[userId] || isAddingFriend;
    const isUserFriend = (userId) => friendList.includes(userId);

    if (isLoadingUsers) {
        return <UserSkeleton />
    }

    return (
        <div className="flex justify-center w-full min-h-screen items-start py-10">
            <div className="bg-base-100 rounded-lg shadow-sm border border-base-300 overflow-hidden w-11/12 max-w-2xl">
                {/* Header */}
                <div className="bg-base-200 px-6 py-4 border-b border-base-300">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-base-content">Discover People</h2>
                            <p className="text-sm text-base-content/60">Connect with new friends</p>
                        </div>
                    </div>
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 bg-base-100 text-base-content"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="max-h-96 overflow-y-auto">
                    {filteredUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-6">
                            <div className="p-3 bg-base-200 rounded-full mb-4">
                                <Users className="w-8 h-8 text-base-content/40" />
                            </div>
                            <h3 className="text-lg font-medium text-base-content mb-2">
                                {searchTerm ? 'No users found' : 'No users available'}
                            </h3>
                            <p className="text-base-content/60 text-center max-w-sm">
                                {searchTerm
                                    ? `No users match "${searchTerm}". Try a different search term.`
                                    : 'There are no users to display at the moment.'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-base-200">
                            {filteredUsers.map(user => (
                                <div
                                    key={user._id}
                                    className="p-4 hover:bg-base-200 transition-colors duration-150 group rounded-lg"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                                            {/* Avatar */}
                                            <div className="flex-shrink-0">
                                                {user.profilePic ? (
                                                    <img
                                                        src={user.profilePic}
                                                        alt={user.fullName}
                                                        className="w-10 h-10 rounded-full border-2 border-primary object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-primary/80 rounded-full flex items-center justify-center text-white font-medium text-sm shadow">
                                                        {user.fullName.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            {/* User Info */}
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-base-content truncate">
                                                    {user.fullName}
                                                </p>
                                                <div className="flex items-center text-xs text-base-content/60 mt-1">
                                                    <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                                                    <span className="truncate">{user.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Add Friend Button */}
                                        <div className="flex-shrink-0 ml-4">
                                            <button
                                                aria-label={isUserFriend(user._id) ? "Already friends" : "Add as friend"}
                                                onClick={() => handleAddFriend(user._id)}
                                                disabled={isUserFriend(user._id) || isUserAdding(user._id)}
                                                className={`
                                                    inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200
                                                    ${isUserFriend(user._id)
                                                        ? 'bg-success/10 text-success cursor-default'
                                                        : isUserAdding(user._id)
                                                        ? 'bg-primary/10 text-primary cursor-wait'
                                                        : 'bg-primary text-primary-content hover:bg-primary/90 hover:shadow-md transform hover:scale-105 active:scale-95'
                                                    }
                                                    disabled:cursor-not-allowed disabled:opacity-75
                                                `}
                                                title={
                                                    isUserFriend(user._id)
                                                        ? 'Already friends'
                                                        : isUserAdding(user._id)
                                                            ? 'Adding friend...'
                                                            : 'Add as friend'
                                                }
                                            >
                                                {isUserFriend(user._id) ? (
                                                    <>
                                                        <Check size={12} />
                                                        <span>Friends</span>
                                                    </>
                                                ) : isUserAdding(user._id) ? (
                                                    <>
                                                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                        <span>Adding...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlus size={12} />
                                                        <span>Add Friend</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {filteredUsers.length > 0 && (
                    <div className="bg-base-200 px-6 py-3 border-t border-base-300">
                        <p className="text-xs text-base-content/60 text-center">
                            Showing {filteredUsers.length} of {users.length} users
                            {searchTerm && ` matching "${searchTerm}"`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UsersContainer