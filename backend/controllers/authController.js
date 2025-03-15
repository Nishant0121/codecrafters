import { Readable } from "stream";
import { User } from "../schema/userSchema.js";
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "./adkey.json",
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});
const drive = google.drive({ version: "v3", auth });

export const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const fileMetadata = {
      name: req.file.originalname,
      parents: ["1rG7UtCJQih2TWs1WBPKnh9PKKeT1vp6X"],
    };

    // Convert buffer to a readable stream
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer); // Push the buffer into the stream
    bufferStream.push(null); // End the stream

    const media = {
      mimeType: req.file.mimetype,
      body: bufferStream, // Pass the readable stream here
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    await drive.permissions.create({
      fileId: file.data.id,
      requestBody: { role: "reader", type: "anyone" },
    });

    const fileUrl = `https://drive.google.com/file/d/${file.data.id}/view`;
    res.json({ url: fileUrl });
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).json({ message: "Error uploading file" });
  }
};

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Check if uploaded file is an image
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res
        .status(400)
        .json({ message: "Invalid file type. Only images are allowed." });
    }

    const fileMetadata = {
      name: req.file.originalname, // Keep the original file name
      parents: ["1rG7UtCJQih2TWs1WBPKnh9PKKeT1vp6X"], // Change to your Drive folder ID
    };

    // Convert buffer to a readable stream
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);

    const media = {
      mimeType: req.file.mimetype,
      body: bufferStream,
    };

    // Upload image to Google Drive
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id", // Get file ID
    });

    if (!file.data || !file.data.id) {
      return res
        .status(500)
        .json({ message: "Failed to upload image to Google Drive" });
    }

    // Make the image publicly accessible
    await drive.permissions.create({
      fileId: file.data.id,
      requestBody: { role: "reader", type: "anyone" },
    });

    // Generate the image URL
    const imageUrl = `https://drive.google.com/uc?id=${file.data.id}`;

    res.json({ url: imageUrl });
  } catch (err) {
    console.error("Error uploading image:", err);
    res
      .status(500)
      .json({ message: "Error uploading image", error: err.message });
  }
};
