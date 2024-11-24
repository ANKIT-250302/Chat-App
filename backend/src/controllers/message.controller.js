import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";
export const getUserForSidebar = async (req,res)=>{
    try {
        const loggedUser = req.user._id
        const filteredUser = await User.find({_id:{$ne:loggedUser}}).select("-password");
        res.status(200).json(filteredUser);
    } catch (error) {
        console.log("Error in Get User controller",error.message);
        res.status(500),json({error:"Internal Server error"});
    }
}

export const getMessages =async (req,res)=>{
    try {
         const{id:userToChatId} = req.params
         const myId = req.user._id

         const message = await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
         });
         res.status(200).json(message)
    } catch (error) {
        console.log("Error in getMessage controller:",error.message);
        re.status(500).json({
            error:"Internal server Errror"
        })
        
    }
}

export const sendMessage= async (req,res) =>{
    try {
        const {text,image}= req.body
        const {id:recieverId}= req.params

        let imageUrl;
        if( image){
            //upload base64 Image to the cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        });

        await newMessage.save();
        //realtime functionality gose here that si socket.io
        res.status(201).json(newMessage)

    } catch (error) {
        console.log('Error in sendMessage controller:', error.message);
        res.status(500).json({error:"Internal server error"})
        
    }
}