import { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import { useUserStore } from '../store/useUserStore'
import SidebarSkeleton from './skeletons/SidebarSkeleton'
import { Users } from "lucide-react"

const Sidebar = () => {
  const { getUsersForSidebar, users, selectedUser, setSelectedUser, isLoadingUsers } = useChatStore()
  const { onlineUsers } = useAuthStore();
  const { friendList } = useUserStore();

  // Only show users who are in the current user's friendList
  const filteredUsers = users.filter(user => friendList.includes(user._id));

  // Fetch sidebar users when friendList changes
  useEffect(() => {
    getUsersForSidebar();
  }, [getUsersForSidebar, friendList]);

  if (isLoadingUsers) return <SidebarSkeleton />

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <div className="overflow-y-auto w-full py-3">
          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}
          {filteredUsers.length === 0 && (
            <div className="text-center text-zinc-500 py-4">
              {friendList.length === 0 ? "No friends yet" : "No friends found"}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar