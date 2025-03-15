import multer from "multer";
import {
  addUser,
  uploadFile,
  uploadImage,
} from "../controllers/authController.js";
import express from "express";
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Define routes
router.post("/adduser", addUser);
router.post("/upload-resume", upload.single("file"), uploadFile);
router.post("/upload-image", upload.single("image"), uploadImage);

export default router;
