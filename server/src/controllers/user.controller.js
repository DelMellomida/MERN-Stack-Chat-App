import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const editProfile = async (req, res) => {
    try{
        const loggedInUserId = req.user._id;
        const { fullName, email, profilePic } = req.body;

        if (!fullName) {
            return res.status(400).json({ error: "Full name is required" });
        }

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(
            loggedInUserId,
            { fullName, email, profilePic },
            { new: true }
        ).select("-password");

        // Notify the user about the profile update
        const receiverSocketId = getReceiverSocketId(loggedInUserId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("profileUpdated", updatedUser);
        }

        res.status(200).json(updatedUser);

    }catch(error){
        console.error("Error in editProfile controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // Get the logged-in user's friendList
        const user = await User.findById(loggedInUserId).select("friendList");
        const friendIds = user.friendList.map(id => id.toString());

        // Add the user's own ID to the exclusion list
        friendIds.push(loggedInUserId.toString());

        // Find users not in friendList and not the user themselves
        const nonFriends = await User.find({
            _id: { $nin: friendIds }
        }).select("-password");

        res.status(200).json(nonFriends);
    } catch (error) {
        console.error("Error in getNonFriends controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const addFriend = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const { friendId } = req.body;

        if (!friendId) {
            return res.status(400).json({ error: "Friend ID is required" });
        }

        // Prevent adding self as friend
        if (loggedInUserId.toString() === friendId) {
            return res.status(400).json({ error: "You cannot add yourself as a friend" });
        }

        // Check if friend exists
        const friendUser = await User.findById(friendId);
        if (!friendUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Add friend to user's friendList
        const updatedUser = await User.findByIdAndUpdate(
            loggedInUserId,
            { $addToSet: { friendList: friendId } }, // $addToSet prevents duplicates
            { new: true }
        ).select("-password");

        // Get socket IDs for real-time updates
        const userSocketId = getReceiverSocketId(loggedInUserId);
        const friendSocketId = getReceiverSocketId(friendId);

        // Notify the user who added the friend
        if (userSocketId) {
            io.to(userSocketId).emit("friendAdded", {
                updatedUser,
                newFriend: friendUser
            });
        }

        // Optionally notify the friend that they were added
        if (friendSocketId) {
            io.to(friendSocketId).emit("addedAsFriend", {
                addedBy: {
                    _id: updatedUser._id,
                    fullName: updatedUser.fullName,
                    profilePic: updatedUser.profilePic
                }
            });
        }

        // If implementing mutual friendship, uncomment and modify this:
        const updatedFriend = await User.findByIdAndUpdate(
            friendId,
            { $addToSet: { friendList: loggedInUserId } },
            { new: true }
        ).select("-password");
        
        if (friendSocketId) {
            io.to(friendSocketId).emit("friendAdded", {
                updatedUser: updatedFriend,
                newFriend: updatedUser
            });
        }

        res.status(200).json({
            message: "Friend added successfully",
            updatedUser,
            addedFriend: friendUser
        });
    } catch (error) {
        console.error("Error in addFriend controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const removeFriend = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const { friendId } = req.body;

        const aiId = "684251b5358f99bf8284cc76";

        if (!friendId) {
            return res.status(400).json({ error: "Friend ID is required" });
        }

        if(friendId === aiId) return res.status(400).json({ error: "Cannot remove AI from friend list" });

        // Get friend info before removing
        const friendUser = await User.findById(friendId).select("fullName profilePic");
        if (!friendUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Remove friend from user's friendList
        const updatedUser = await User.findByIdAndUpdate(
            loggedInUserId,
            { $pull: { friendList: friendId } }, // $pull removes the specified item
            { new: true }
        ).select("-password");

        // Get socket IDs for real-time updates
        const userSocketId = getReceiverSocketId(loggedInUserId);
        const friendSocketId = getReceiverSocketId(friendId);

        // Notify the user who removed the friend
        if (userSocketId) {
            io.to(userSocketId).emit("friendRemoved", {
                updatedUser,
                removedFriend: friendUser,
                removedFriendId: friendId
            });
        }

        // Optionally notify the friend that they were removed
        if (friendSocketId) {
            io.to(friendSocketId).emit("removedAsFriend", {
                removedBy: {
                    _id: updatedUser._id,
                    fullName: updatedUser.fullName,
                    profilePic: updatedUser.profilePic
                }
            });
        }

        // If implementing mutual friendship removal, uncomment and modify this:
        await User.findByIdAndUpdate(
            friendId,
            { $pull: { friendList: loggedInUserId } }
        );

        await Message.deleteMany({
            $or: [
                { senderId: loggedInUserId, receiverId: friendId },
                { senderId: friendId, receiverId: loggedInUserId }
            ]
        });
        
        // const updatedFriend = await User.findById(friendId).select("-password");
        if (friendSocketId) {
            io.to(friendSocketId).emit("friendRemoved", {
                updatedUser: updatedFriend,
                removedFriend: updatedUser,
                removedFriendId: loggedInUserId
            });
        }

        res.status(200).json({
            message: "Friend removed successfully",
            updatedUser,
            removedFriend: friendUser
        });
    } catch (error) {
        console.error("Error in removeFriend controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};