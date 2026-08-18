import mongoose from "mongoose";

const foodHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foodName: {
      type: String,
      required: true,
      trim: true,
    },
    calories: {
      type: Number,
      required: true,
      default: 0,
    },
    portionEstimate: {
      type: String,
      default: "",
    },
    estimatedGrams: {
      type: Number,
      default: 0,
    },
    protein: {
      type: Number,
      default: 0,
    },
    carbohydrates: {
      type: Number,
      default: 0,
    },
    fat: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    confidence: {
      type: Number,
      default: 0,
    },
    nutritionSource: {
      type: String,
      default: "gemini_estimate",
    },
    items: [
      {
        foodName: {
          type: String,
          required: true,
          trim: true,
        },
        portionEstimate: {
          type: String,
          default: "",
        },
        estimatedGrams: {
          type: Number,
          default: 0,
        },
        calories: {
          type: Number,
          default: 0,
        },
        protein: {
          type: Number,
          default: 0,
        },
        carbohydrates: {
          type: Number,
          default: 0,
        },
        fat: {
          type: Number,
          default: 0,
        },
        confidence: {
          type: Number,
          default: 0,
        },
        nutritionReference: {
          source: {
            type: String,
            default: "",
          },
          fdcId: {
            type: Number,
            default: null,
          },
          description: {
            type: String,
            default: "",
          },
          per100g: {
            calories: {
              type: Number,
              default: 0,
            },
            protein: {
              type: Number,
              default: 0,
            },
            carbohydrates: {
              type: Number,
              default: 0,
            },
            fat: {
              type: Number,
              default: 0,
            },
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const FoodHistory = mongoose.model("FoodHistory", foodHistorySchema);

export default FoodHistory;
