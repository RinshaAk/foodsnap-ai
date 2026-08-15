import {
    getHistoryService,
    getHistoryByIdService,
    deleteHistoryService
} from "../services/HistoryService.js";

export const getHostory = async(req,res)=>{
    try{
        const History = await getHistoryService(req.user);
        res.status(200).json({
            success:true,
            message:"History fetched successfully",
            data:History
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }


}

export const getHistoryById = async(req,res)=>{
    try{
        const history = await getHistoryByIdService(
            req.pqarams.id,
            req.user.id
        );
        res.status(200).json({
            success:true,
            message:"History fetched successfully",
            data:history
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const deleteHistory = async(req,res)=>{
    try{
        await deleteHistoryService(req.params.id, req.user.id);
        res.status(200).json({
            success:true,
            message:"History deleted successfully",
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    
    }
}