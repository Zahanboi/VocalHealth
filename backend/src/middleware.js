import { User } from "./models/userModel.js";
import wrapAsync from "./utils/wrapAsync.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import path from "path";

export const verifyUserJWT = wrapAsync(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized request" });
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded?._id).select("-password -refreshToken");
    if (!user) return res.status(401).json({ success: false, message: "Invalid Access Token" });
    req.user = user;
    next();
});

const uploadPath = path.resolve("./backend/uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
const storage = multer.diskStorage({
    destination: uploadPath,
    filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
export const upload = multer({ storage });