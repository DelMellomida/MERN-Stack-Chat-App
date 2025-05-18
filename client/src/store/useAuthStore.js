import {create} from 'zustand';
import {axiosInstance} from '../lib/axios';
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,

    isCheckingAuth:true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/auth/check');
            set({ authUser: res.data });
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
            toast.success("Login successful!");
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
    }
}));