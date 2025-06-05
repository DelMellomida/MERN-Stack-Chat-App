import {useRef, useState} from 'react'
import { X, Image, Send } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import toast from "react-hot-toast";

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessage, selectedUser } = useChatStore();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")){
            toast.error("Please select a valid image file.");
            return;
        } 

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        console.log(reader);
    };

    const removeImage = () => {
        setImagePreview(null);
        if(fileInputRef.current) fileInputRef.current.value = null; 
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) {
            return;
        }

        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview,
            });
            setText("");
            setImagePreview(null);
            if(fileInputRef.current) fileInputRef.current.value = null; 
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message.");
        }
    };
  return (
    <div className='p-4 w-full'>
        {imagePreview && (
            <div className='mb-3 flex items-center gap-2'>
                <div className='relative'>
                    <img 
                        src={imagePreview} 
                        alt="Preview"
                        className='s-20 object-cover rounded-lg border border-zinc-700' 
                    />
                </div>
                <button 
                    onClick={removeImage}
                    className='absolute -top-1.5 -right-1.5 s-5 rounded-full bg-base-300 flex items-center justify-center hover:bg-base-content/10 transition-colors'
                    type='button'
                >
                    <X className='size-3' />
                </button>
            </div>
        )}
        <form 
            onSubmit={handleSendMessage} 
            className='flex items-center gap-3'>
                <div className='flex-1 flex gap-2'>
                    <input type="text" 
                        className='w-full input input-bordered rounded-lg input-sm sm:input-md'
                        placeholder='Type a message'
                        value={text}
                        onChange={(e) => {setText(e.target.value)}}
                    />
                    <input type="file"
                        accept='image/*'
                        className='hidden'
                        ref={fileInputRef}
                        onChange={handleImageChange} 
                    />
                    <button type='button'
                        className={`hidden sm:flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"} btn-sm`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Image size={20}/>
                    </button>
                    <button type='submit'
                        className='btn btn-sm btn-circle'
                        disabled={!text.trim() && !imagePreview}
                    >
                        <Send size={18} />
                    </button>
                </div>
        </form>
    </div>
  )
}

export default MessageInput