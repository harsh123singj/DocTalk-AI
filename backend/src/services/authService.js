import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const registerUser = async ({name,email,password})=>{
if(!name || !email || !password){
    throw new Error("Name, email and password are required")
    
}

const hashedPass= await bcrypt.hash(password ,10);

const normalizedEmail=email.trim().toLowerCase();
const existingUser =await User.findOne({email : normalizedEmail});
if(existingUser){
    throw new Error("User already exists");
}

const newUser = new User ({
    name:name.trim(),
    email:normalizedEmail,
    password:hashedPass,
    authProvider:"local"
})

const savedUser = await newUser.save();

const token = generateToken(savedUser._id);


const safeUser = {
    id: savedUser._id,
    name : savedUser.name,
    email:savedUser.email,
    authProvider: savedUser.authProvider,
    avatar: savedUser.avatar,
    isVerified : savedUser.isVerified
};


return {
    user : safeUser,
    token
}
}



export const loginUser = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
        email: normalizedEmail
    });

    if (!existingUser) {
        throw new Error("Invalid email or password");
    }

    const correctPassword = await bcrypt.compare(
        password,
        existingUser.password
    );

    if (!correctPassword) {
        throw new Error("Invalid email or password");
    }

    const token = generateToken(existingUser._id);

    const safeUser = {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        authProvider: existingUser.authProvider,
        avatar: existingUser.avatar,
        isVerified: existingUser.isVerified
    };

    return {
        user: safeUser,
        token
    };
};

export default registerUser;