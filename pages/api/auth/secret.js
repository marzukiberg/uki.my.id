import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { secret } = req.body;

    // Replace with your actual secret key from environment variables
    const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY;

    if (secret === AUTH_SECRET_KEY) {
      // Set a cookie or token for authentication
      res.setHeader(
        "Set-Cookie",
        serialize("auth", "true", {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 60 * 60 * 24 * 7, // 1 week
          sameSite: "strict",
        })
      );
      res.status(200).json({ authenticated: true });
    } else {
      res
        .status(401)
        .json({ authenticated: false, message: "Invalid secret key" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
