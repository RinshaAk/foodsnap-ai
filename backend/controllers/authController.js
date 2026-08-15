import { registerUserService, loginUserService } from '../services/authService.js';


export const registerUser = async (req,res)=>{
    try {
        const result = await registerUserService(req.body);
        res.status(200).json({
            success:true,
            message:"User registered successfully",
            data:result
        })
    }catch (error) {
        res.status(400).json({
            success:false,
            message: error.message
        })
    }
}

export const loginUser=  async (req,res)=>{
    try{
        const result = await loginUserService(req.body);
        res.status(200).json({
            success:true,
            message:"User logged in successfully",
            data:result
        })
    }catch(error){
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}