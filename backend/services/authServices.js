import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const registerUserService = async ({name,email,password})=>{
    if(!name||!email||!password){
        throw new Error("please fill all fields");
    }

    const userExists = await User.findOne({email});
    if(userExists){
        throw new Error("user already exists")
    }
     const hashedPassword = await bcrypt.hash(password,10);

     const user = await User.create({
        name,email,password:hashedPassword,
     });
     return{
        id:user._id,
        name:user.name,
        email:user.email,
     };
};

export const loginUserService = async({email,password})=>{
    if(!email||!passsword){
        throw new Error("please fill all fields");
    }

    const user = await User.findOne({email});
    if(!user){
        throw new Error("user does not exist")
    }

    const isPasswordValied = await bcrypt.compare(
        password,
        user.password
    );
    if(!isPasswordValied){
        throw new Error("invalied email or password")
    }

    const tocken = jwt.sign(
        {
            id:user.id,
            email:user.email,
        },
        process.env.JWT_SECRET,
        {
            expireIn:"1d"
        }
    );
    return {
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
        },
        token,
    }
}




