import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Use environment variable for security
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Set desired limit
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const fileStr = req.body.file; // Base64 encoded string
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "your_upload_preset_name", // Replace with your upload preset
      folder: "portfolio", // Optional: specify a folder
    });

    res.status(200).json({
      public_id: uploadResponse.public_id,
      url: uploadResponse.secure_url,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    res
      .status(500)
      .json({ message: "Error uploading image", error: error.message });
  }
}
