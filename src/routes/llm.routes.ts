import { Router } from "express";
import { handleTextRequest } from "../controllers/textController";
import { handleFileRequest } from "../controllers/fileController";
import { validateTextRequest } from "../middleware/validation";
import { asyncHandler } from "../middleware/errorHandler";
import multer from "multer";

const router = Router();

/**
 * POST /api/llm/text
 * Receives a string and generates an LLM response
 */
router.post("/text", validateTextRequest, asyncHandler(handleTextRequest));

/**
 * Configuration multer for file uploader
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype === "text/plain") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

router.post("/file", upload.single("file"), handleFileRequest);

/**
 * POST /api/llm/file
 * Receives file data (PDF or text/plain) and processes it with LLM
 */
//router.post("/file", validateFileRequest, asyncHandler(handleFileRequest));

export default router;
