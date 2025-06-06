import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import toast from "react-hot-toast";
import { useAuthStore } from './useAuthStore';

export const useUserStore = create((set, get) => ({
    authUser: null,
    selectedUser: null,
    isAddingFriend: false,
    isRemovingFriend: false,
    isLoadingUsers: false,
    friendList: [],
    users: [],
    socket: null,

    // Initialize socket connection and listeners
    initializeSocket: (socket) => {
        set({ socket });
        
        if (socket) {
            // Remove existing listeners to prevent duplicates
            socket.off("friendAdded");
            socket.off("friendRemoved");
            socket.off("addedAsFriend");
            socket.off("removedAsFriend");
            
            // Listen for friend added events
            socket.on("friendAdded", (data) => {
                const { updatedUser, newFriend } = data;
                // Update both stores
                useAuthStore.getState().setAuthUser(updatedUser);
                set({ friendList: updatedUser.friendList, authUser: updatedUser });
                get().loadUsers();
                toast.success(`${newFriend.fullName} added as friend!`);
            });
            
            // Listen for friend removed events
            socket.on("friendRemoved", (data) => {
                const { updatedUser, removedFriend } = data;
                // Update both stores
                useAuthStore.getState().setAuthUser(updatedUser);
                set({ friendList: updatedUser.friendList, authUser: updatedUser });
                get().loadUsers();
                toast.success(`${removedFriend.fullName} removed from friends`);
            });
            
            // Listen for being added as friend by someone else
            socket.on("addedAsFriend", (data) => {
                const { addedBy } = data;
                toast.info(`${addedBy.fullName} added you as a friend!`);
            });
            
            // Listen for being removed as friend by someone else
            socket.on("removedAsFriend", (data) => {
                const { removedBy } = data;
                toast.info(`${removedBy.fullName} removed you from their friends`);
            });
        }
    },

    // Clean up socket listeners
    disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
            socket.off("friendAdded");
            socket.off("friendRemoved");
            socket.off("addedAsFriend");
            socket.off("removedAsFriend");
        }
        set({ socket: null });
    },

    loadUsers: async (params) => {
        set({ isLoadingUsers: true });
        try {
            const res = await axiosInstance.get("/users/all-users", { params });
            set({ users: res.data });
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users");
        } finally {
            set({ isLoadingUsers: false });
        }
    },

    addFriend: async (friendId) => {
        set({ isAddingFriend: true });
        try {
            const res = await axiosInstance.post(`/users/add-friend`, { friendId });
            
            // The socket listener will handle the state updates
            // But we can also update immediately for better UX
            const currentFriendList = get().friendList;
            if (!currentFriendList.includes(friendId)) {
                set({ friendList: [...currentFriendList, friendId] });
            }
            
        } catch (error) {
            console.error("Error adding friend:", error);
            toast.error(error.response?.data?.error || "Failed to add friend");
        } finally {
            set({ isAddingFriend: false });
        }
    },

    removeFriend: async (friendId) => {
        set({ isRemovingFriend: true });
        try {
            const res = await axiosInstance.post(`/users/remove-friend`, { friendId });
            
            // The socket listener will handle the state updates
            // But we can also update immediately for better UX
            const currentFriendList = get().friendList;
            set({ friendList: currentFriendList.filter(id => id !== friendId) });
            
        } catch (error) {
            console.error("Error removing friend:", error);
            toast.error(error.response?.data?.error || "Failed to remove friend");
        } finally {
            set({ isRemovingFriend: false });
        }
    },

    // Update friend list (can be called externally)
    updateFriendList: (friendList) => {
        set({ friendList });
    },

    // Set auth user (sync with auth store)
    setAuthUser: (user) => {
        set({ 
            authUser: user,
            friendList: user?.friendList || [] 
        });
    }
}));