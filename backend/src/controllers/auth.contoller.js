import { json } from "express";
import { generateToken } from "../lib/jwt.token.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js"


export const signup= async (req,res)=>{
    const {email,fullname,password} = req.body;
    
    
    try {

        if(!fullname || !email || !password ){
            return res.status(400).json({message:"All fields are required"})
        }
        if(password.length<6){
            // return res.status(400).json({message:"Password must be at least 6 characters.."})
        }
        
        const user = await User.findOne({email});
        
        if(user){
            return res.status(400).json({message:"User already Exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = new User({
            fullname,
            email,
            password:hashedPassword
        })
        
        if(newUser){
            generateToken(newUser._id,res)
            await newUser.save()

            res.status(201).json({
                _id:newUser._id,
                fullname:newUser.fullname,
                email:newUser.email,
                profilepic:newUser.profilepic

            })
        }
        else{
            res.status(400).json({message:"Invalid User"})
        }
    } catch (error) {
        console.log('Error in signup controller', error.message);
        res.status(500).json({
            message:"Internal Server error"
        })
        
    }

}
export const login= async (req,res)=>{
    try {
        const {email,password} = req.body;

        const user= await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"Invalid credentials!"})
        }

        console.log(user);
        

        const isPasswordCorrect = await bcrypt.compare(password,user.password);

        if(!isPasswordCorrect){
            return res.status(400).json({
                message:"Invalid Credentials! finding"
            })
        }
        generateToken(user._id,res);

        res.status(200).json({
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            profilepic:user.profilepic
        })
        
    } catch (error) {
        console.log("Error in login Controller",error.message);
        res.status(500),json({
            message:"Internal server error!"
        })
    }
}
export const logout=(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({
            message:"LogOut Successfully"
        })
    } catch (error) {
        console.log("Error in login Controller",error.message);
        res.status(500),json({
            message:"Internal server error!"
        })
        
    }
}
export const updateProfile= async (req,res)=>{
    try {
        const {profilepic} =req.body;
        const userId = req.user._id;
        if(!profilepic){
            return res.status(400).json({
                message:"Profile is required!"
            })
        }

        const uploadResponse = await cloudinary.uploader.upload(profilepic);
        const updateUser = await User.findByIdAndUpdate(userId,{profilepic:uploadResponse.secure_url},{new:true})

        res.status(200).json(updateUser);


    } catch (error) {
        console.log("Error in Update profile",error.message);
        res.status(500),json({
            message:"Internal server error!"
        })
    }
}
export const checkAuth= (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller",error.message);
        res.status(500).json({
            message:"Internal Server Error"
        });
        
    }
}