import { Router } from "express";
import { insertPost, join, render } from "../controllers/index.js";

const router = Router();

router.get("/", render);
router.post("/", insertPost);
router.post("/join", join);

export default router;
