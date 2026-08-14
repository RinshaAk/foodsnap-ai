import mongoose from "mongoose"

const foodScanSchema = new mongoose.Schema(
    {
        foodName:{
            type:String,
            required:true
        },
        calories:{
            type:Number,
            required:true
        },
        protein:{
        type:Number,
        default:0,
    },
    carbohydrates:{
        type:Number,
        default:0,
    },
    fat:{
        type:Number,
        default:0,
    },
    },
    {
        timestamps:true
    }
    
);
const FoodScan = mongoose.model("FoodScan",foodScanSchema);
export default FoodScan;



