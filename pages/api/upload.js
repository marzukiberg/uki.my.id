import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false, // Disable body parser for file uploads
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Configure formidable for file upload
    const form = formidable({
      uploadDir: path.join(process.cwd(), "public", "img", "logos"),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      filename: (name, ext) => `${uuidv4()}${ext}`,
    });

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Parse the form
    const [fields, files] = await form.parse(req);

    // Get the uploaded file
    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Generate public path
    const relativePath = path.relative(
      path.join(process.cwd(), "public"),
      file.filepath
    );
    const publicPath = `/${relativePath.replace(/\\/g, "/")}`;

    console.log("Upload successful:", {
      path: publicPath,
      filename: path.basename(file.filepath),
      originalName: file.originalFilename,
      size: file.size,
    });

    res.status(200).json({
      success: true,
      path: publicPath,
      filename: path.basename(file.filepath),
      originalName: file.originalFilename,
      size: file.size,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading file",
      error: error.message,
    });
  }
}
