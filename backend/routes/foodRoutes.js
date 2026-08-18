import express from "express";
import multer from "multer";
import path from "path";

import { analyzeFood } from "../controllers/foodController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;

    const extension = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    const mimeType = allowedTypes.test(file.mimetype);

    if (extension && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

const uploadFoodImage = (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return next();
  });
};

router.post(
  "/analyze",
  protect,
  uploadFoodImage,
  analyzeFood
);

export default router;
