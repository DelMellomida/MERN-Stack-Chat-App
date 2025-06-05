import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
    chatMessages: [],
    users: [],
    selectedUser: null,
    isLoadingUsers: false,
    isLoadingMessages: false,

    getUsersForSidebar: async () => {
        set({ isLoadingUsers: true });
        try {
            const res = await axiosInstance.get('/messages/users');
            set({ users: res.data });
        } catch (error) {
            console.error("Error fetching users for sidebar:", error.response || error.message || error);
            toast.error("Failed to load users");
        } finally {
            set({ isLoadingUsers: false });
        }
    },

    getMessages: async (userId) => {
        set({ isLoadingMessages: true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ chatMessages: res.data });
        } catch (error) {
            console.error("Error fetching messages:", error.response || error.message || error);
            toast.error("Failed to load messages");
        } finally {
            set({ isLoadingMessages: false });
        }
    },
    
    sendMessage: async(messageData) => {
        const {selectedUser, chatMessages} = get();
        try{
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ chatMessages: [...chatMessages, res.data] });
        }catch(error){
            console.error("Error sending message:", error.response || error.message || error);
            toast.error("Failed to send message");
        }
    },

    setSelectedUser: (selectedUser) => {
        set({ selectedUser });
        // console.log("User Id", selectedUser._id);
    },
}));
