const errorHandler =(req,res,next)=>{
    const statuscode=err.statuscode || 500;
    res.status(statuscode).json({
        success:false,
        message:err.message || "Server Error"
    })
}
export default errorHandler;