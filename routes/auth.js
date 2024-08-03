import { Router } from "express";
import {
  renderLoginPage,
  renderSignUpPage,
  validationAndSignUpMiddleware,
  loginMiddlewares,
} from "../controllers/auth.js";

const router = Router();

router.get("/login", renderLoginPage);

router.post("/login", loginMiddlewares);

router.get("/signup", renderSignUpPage);
router.post("/signup", validationAndSignUpMiddleware);

export default router;
