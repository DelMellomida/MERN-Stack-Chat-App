import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import toast from "react-hot-toast";
import { useAuthStore } from './useAuthStore';

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
            let res;
            if(selectedUser._id !== "684251b5358f99bf8284cc76"){
                // Regular user chat
                res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
                set({ chatMessages: [...chatMessages, res.data] });
            }else{
                // AI chat - don't add to state here, let socket handle it
                res = await axiosInstance.post(`/messages/chat/${selectedUser._id}`, messageData);
                // The user message and AI reply will come through socket emissions
            }
        }catch(error){
            console.error("Error sending message:", error.response || error.message || error);
            toast.error("Failed to send message");
        }
    },


    subscribeToMessages: () => {
        const {selectedUser} = get();
        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket;
        socket.on('newMessage', (newMessage) => {
            const isMessageSentToSelectedUser = newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id;
            
            if (isMessageSentToSelectedUser) {
                set({
                    chatMessages: [...get().chatMessages, newMessage],
                })
            }
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off('newMessage');
    },

    setSelectedUser: (selectedUser) => {
        set({ selectedUser });
        // console.log("User Id", selectedUser._id);
    },
}));
