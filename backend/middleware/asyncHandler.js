const asyncHandler = (fn)=>{
    return(req,res,next)=>{
        Promise.resolve(fn(req,res,next))
    }
}
export default asyncHandler;