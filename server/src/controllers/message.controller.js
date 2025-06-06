import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { askOpenRouter } from "../lib/openai.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;
		const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select("-password");

		res.status(200).json(filteredUsers);
	}catch(error){
		console.error("Error in getUsersForSidebar controller", error.message);
		res.status(500).json({error: "Internal Server Error"});
	}
};

export const getMessages = async (req, res) => {
	try{
		const {id:userToChatId} = req.params;
		const myId = req.user._id;

		const messages = await Message.find({
			$or:[
				{senderId:myId, receiverId:userToChatId},
				{senderId:userToChatId, receiverId:myId}
			]
			});

		res.status(200).json(messages);
	} catch (error){
		console.error("Error in getMessages controller", error.message);
		res.status(500).json({error: "Internal Server Error"});
	}
};


export const sendMessage = async (req, res) => {
	try{
		const {text, image} = req.body;
		const {id:receiverId} = req.params;
		const senderId = req.user._id;

		let imageUrl;

		if(image){
			const uploadResponse = await cloudinary.uploader.upload(image);
			imageUrl = uploadResponse.secure_url;
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			text,
			image: imageUrl,
		});

		await newMessage.save();

		const receiverSocketId = getReceiverSocketId(receiverId);

		if(receiverSocketId){
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);	
		
	} catch(error){
		console.error("Error in sendMessage controller", error.message);
		res.status(500).json({error: "Internal Server Error"});
	}
};

export const aiAssistant = async(req, res) =>{
	try{
		const {text} = req.body;
		const senderId = req.user._id;
		const aiId = "684251b5358f99bf8284cc76";

		// Save user message
		const userMessageDoc = new Message({
			senderId,
			receiverId: aiId,
			text,
		});
		await userMessageDoc.save();

		const userSocketId = getReceiverSocketId(senderId);
		
		if(userSocketId){
			// First emit the user's message
			io.to(userSocketId).emit("newMessage", userMessageDoc);
			
			// Emit typing indicator
			io.to(userSocketId).emit("aiTyping", { isTyping: true });
		}

		// Get AI reply (this takes time)
		const aiReply = await askOpenRouter([{role: 'user', content: text}]);

		// Save AI message
		const aiMessageDoc = new Message({
			senderId: aiId,
			receiverId: senderId,
			text: aiReply,
		});
		await aiMessageDoc.save();

		if(userSocketId){
			// Stop typing indicator
			io.to(userSocketId).emit("aiTyping", { isTyping: false });
			
			// Then emit the AI response
			io.to(userSocketId).emit("newMessage", aiMessageDoc);
		}

		// console.log(aiReply);

		res.status(201).json(aiMessageDoc);

	}catch(error){
		console.error("Error in aiAssistant controller", error.message);
		res.status(500).json({error: "Internal Server Error"});
	}
};