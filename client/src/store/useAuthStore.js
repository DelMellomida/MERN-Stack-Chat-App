import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useUserStore } from './useUserStore';


const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    onlineUsers: [],
    socket: null,

    isCheckingAuth:true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({ authUser: res.data });
            useUserStore.getState().setAuthUser(res.data);
            get().connectSocket();
        } catch (error) {
            console.error("Error in checkAuth:", error.response || error.message || error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            useUserStore.getState().setAuthUser(res.data);
            toast.success("Signup successful!");
            set({ authUser: res.data });
        }catch (error) {
            toast.error(error.response.data.message);
            console.error("Error in signup:", error.response || error.message || error);
        }finally {
            set({ isSigningUp: false });
        }
    },

    logout: async() => {
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Logged out successfully");
            get().disconnectSocket();
        }catch(error){
            toast.error(error.response.data.message);
            console.error("Error in logout:", error.response || error.message || error);
        }
    },

    login: async(data) => {
        set({isLoggingIn: true});

        try{
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser: res.data});
            useUserStore.getState().setAuthUser(res.data);
            toast.success("Login successful!");

            get().connectSocket();
        }catch(error){
            toast.error(error.response.data.message);
            console.error("Error in login:", error.response || error.message || error);
        }finally{
            set({isLoggingIn:false});
        }
    },

    updateProfile: async(data) => {
        set({ isUpdatingProfile: true });
        try{
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        }catch(error){
            console.log("error in update profile");
            toast.error(error.response.data.message);
        }finally{
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const {authUser} = get();
        if (!authUser || get().socket?.connected) {
            return;
        }
        const socket = io(BASE_URL, {withCredentials: true,
            query: {
                userId: authUser._id
            }
        });
        socket.connect();
        
        set({ socket: socket });

        socket.on('getOnlineUsers', (onlineUsers) => {
            set({ onlineUsers: onlineUsers });
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();

        set({ socket: null});
    }
}));