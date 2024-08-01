import { Router } from "express";
import {
  renderLoginPage,
  login,
  renderSignUpPage,
} from "../controllers/auth.js";

const router = Router();

router.get("/login", renderLoginPage);

router.post("/login", login, (req, res) => {
  res.redirect("../");
});

router.get("/signup", renderSignUpPage);

export default router;
