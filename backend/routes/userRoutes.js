import express from 'express';


const router = express.Router();

router.post('/register',(req,res)=>{
    res.json({
        success:true,
        message:"User registered successfully"
    });
});

router.post('/login',(req,res)=>{
    res.json({
        success:true,
        message:"User logged in successfully"
    });
});

router.post("/me",(req,res)=>{
    res.json({
        success:true,
        message:"Current user routes"
    });
});

export default router;