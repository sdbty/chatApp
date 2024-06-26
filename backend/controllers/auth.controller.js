import bcrypt from "bcryptjs";

import User from "../models/User.model.js";
import generateTokenAndCookie from "../utils/generateToken.js";

const login = async (req, res) => {
    try{
        const {username , password} = req.body;
        const user = await User.findOne({username});

        if(!user){
            return res.status(400).json({error : "Invalid username"})
        }

        const isPasswordCorrect = await bcrypt.compare(password , user.password || "");

        if(!isPasswordCorrect){
            return res.status(400).json({error: "Incorrect password"})
        }

        generateTokenAndCookie(user._id , res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        })

    }catch(error){
        console.log("Error in login controller" , error.message);
        res.status(500).json({error: "Internal server error"})
    }
}

const logout = (req, res) => {
    try{
        res.cookie("jwt" , "" , {maxAge: 0});
        res.status(200).json({message: "Logged out succesfully"});
    }catch(error){
        console.log("Error in logout controller");
        res.status(500).json({error: "Internal server error"})
    }
}

const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (password !== confirmPassword) {
            return res
                .status(400)
                .json({error: "Passwords do not match"})
        }
        const user = await User.findOne({username})
        if(user){
            return res
                .status(400)
                .json({error: "Username already exists"})
        }

        //hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullName ,
            username ,
            password: hashedPassword ,
            gender ,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        })

        if(newUser){
            // generate JWT token
            generateTokenAndCookie(newUser._id , res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
            })
        }else{

        res.status(500).json({error: "Invalid user data"})
        }

    } catch (error) {
        console.log("Error in signup controller");
        res.status(500).json({error: "Internal server error"})
    }
}

export default {
    login,
    logout,
    signup
}