import { Router } from "express";
import {
  render,
  validateAndInsertPostMiddlewares,
  validateAndJoinMiddlewares,
} from "../controllers/index.js";

const router = Router();

router.get("/", render);
router.post("/", validateAndInsertPostMiddlewares);
router.post("/join", validateAndJoinMiddlewares);

export default router;
