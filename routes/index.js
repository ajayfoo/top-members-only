import { Router } from "express";
import {
  join,
  render,
  validateAndInsertPostMiddlewares,
} from "../controllers/index.js";

const router = Router();

router.get("/", render);
router.post("/", validateAndInsertPostMiddlewares);
router.post("/join", join);

export default router;
