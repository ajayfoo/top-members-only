import { Router } from "express";
import {
  deletePost,
  render,
  validateAndBecomeAdminMiddlewares,
  validateAndInsertPostMiddlewares,
  validateAndJoinMiddlewares,
} from "../controllers/index.js";

const router = Router();

router.get("/", render);
router.post("/", validateAndInsertPostMiddlewares);
router.post("/join", validateAndJoinMiddlewares);
router.post("/become-admin", validateAndBecomeAdminMiddlewares);
router.delete("/", deletePost);

export default router;
