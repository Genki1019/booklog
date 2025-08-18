import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const UPLOAD_DIR = path.join(__dirname, "../../uploads");
// 画像アップロード設定
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(UPLOAD_DIR))
            fs.mkdirSync(UPLOAD_DIR);
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        console.log("file.originalname:", file.originalname);
        const extension = file.originalname.split('.').pop();
        cb(null, `${Date.now()}.${extension}`);
    },
});
export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
