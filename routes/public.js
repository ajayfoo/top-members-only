import { Router } from "express";
import { render } from "../controllers/public.js";

const router = Router();

router.get("/", render);

export default router;
