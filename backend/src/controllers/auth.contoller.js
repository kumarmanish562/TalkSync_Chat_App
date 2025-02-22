import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { generateToken } from "../lib/utils.js";  

export const signup = async (req, res) => {  
  const { email, fullName, password } = req.body;

  try {
    if (!email || !fullName || !password) {
      return res.status(400).json({ error: "All fields are required" });
    } 
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
      
     
    });

   
if (newUser) {
 
    // Generate JWT token
    generateToken(newUser._id, res);
    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      profilePic: newUser.profilePic,
      fullName: newUser.fullName,
    });

  } else {
    res.status(400).json({ error: "Invalid user data" });
  }

  } catch (error) {
    console.error("Error in signup controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => { 
  const{ email, password } = req.body;
try{
  const user = await User.findOne({email});

  if(!user){
    return res.status(400).json({error: "Invalid credentials"});
  }
   const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
      return res.status(400).json({error: "Invalid credentials"});
    }
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
    });
  }catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ message: "Internal server error" });

}
};

export const logout = (req, res) => {  
  try{
    res.cookie("jwt", "", {maxAge: 0});
    res.status(200).json({message: "Logged out successfully"});
  }catch (error) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
     
    
  }
 
};

export const updateProfile = async (req, res) => {
  try{
    const {profilePic} = req.body;
     const userId = req.user.id;

     if(!profilePic){
       return res.status(400).json({error: "Profile picture is required"});
     }

     const uploadResponse = await cloudinary.uploader.upload(profilePic);
const updateduser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true});
res.status(200).json(updateduser);


  }catch (error) {
    console.error("Error in updateProfile controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try{
    res.status(200).json(req.user);
  }catch (error) {
    console.error("Error in checkAuth controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};