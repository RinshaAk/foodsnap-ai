import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    dailyCalorieGoal: {
      type: Number,
      default: 2000,
    },

    role: {
      type: String,
      enum: ["user", "owner", "agency_owner", "agency_member"],
      default: "user",
    },

    agencyRole: {
      type: String,
      enum: ["owner", "member", null],
      default: null,
    },

    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
