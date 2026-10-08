import { verifyAuthCookie } from "../../../lib/auth.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const auth = req.cookies.auth;
    if (verifyAuthCookie(auth)) {
      res.status(200).json({ authenticated: true });
    } else {
      res.status(401).json({ authenticated: false });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
