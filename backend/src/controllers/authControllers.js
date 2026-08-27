import registerUserService from "../services/authService.js";
import { loginUser } from "../services/authService.js";
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const result = await registerUserService({
            name,
            email,
            password
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const login =async (req, res)=>{
    try{
        const {email, password}= req.body;
        const loggedInUser = await loginUser({email , password});

        res.status(200).json({
            success:true,
            message:"user login successfull",
            data:loggedInUser
        })
    }
    catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        });
    }

}







export { register };