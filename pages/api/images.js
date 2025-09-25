import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    // Check if uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      return res.status(200).json({ images: [] });
    }

    // Read directory contents
    const files = fs.readdirSync(uploadsDir);

    // Filter for image files
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });

    // Map to image objects with metadata
    const images = imageFiles.map((file) => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);

      return {
        name: file,
        path: `/uploads/${file}`,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
      };
    });

    // Sort by creation date (newest first)
    images.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      images,
      count: images.length,
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching images",
      error: error.message,
    });
  }
}
