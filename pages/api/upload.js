import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Allowed MIME types and magic bytes for image uploads
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

const MAGIC_BYTES = [
  { bytes: [0xff, 0xd8, 0xff], mime: "image/jpeg" },
  { bytes: [0x89, 0x50, 0x4e, 0x47], mime: "image/png" },
  { bytes: [0x47, 0x49, 0x46, 0x38], mime: "image/gif" },
];

function validateMagicBytes(filepath) {
  const buffer = Buffer.alloc(4);
  const fd = fs.openSync(filepath, "r");
  fs.readSync(fd, buffer, 0, 4, 0);
  fs.closeSync(fd);

  return MAGIC_BYTES.some(({ bytes, mime }) =>
    bytes.every((b, i) => buffer[i] === b)
  ) || null;
}

function getMimeFromMagicBytes(filepath) {
  const buffer = Buffer.alloc(4);
  const fd = fs.openSync(filepath, "r");
  fs.readSync(fd, buffer, 0, 4, 0);
  fs.closeSync(fd);

  for (const { bytes, mime } of MAGIC_BYTES) {
    if (bytes.every((b, i) => buffer[i] === b)) return mime;
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const form = formidable({
      uploadDir: path.join(process.cwd(), "public", "img", "logos"),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024,
      filename: (name, ext) => `${uuidv4()}${ext}`,
    });

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const [fields, files] = await form.parse(req);

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const detectedMime = file.mimetype || getMimeFromMagicBytes(file.filepath);
    if (!ALLOWED_TYPES.has(detectedMime)) {
      await fs.promises.rm(file.filepath, { force: true });
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
      });
    }

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
    });
  }
}
