import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const protectRoute = async (req , res , next) => {
    try{
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({error: "Unauthorized , no token provided"});
        }
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({error: "Unauthorized , invalid token"});
        }
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        req.user = user;
        next()
    }catch(err){
        console.log("Error in middleware protect" , err.message);
        res.status(500).json({error: "Internal server error"})
    }
}

export default protectRoute;
