import { Router } from "express";
import { insertPost, render } from "../controllers/index.js";

const router = Router();

router.get("/", render);
router.post("/", insertPost);

export default router;
