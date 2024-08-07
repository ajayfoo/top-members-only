import { Router } from "express";
import {
  renderLoginPage,
  renderSignUpPage,
  validationAndSignUpMiddleware,
  loginMiddlewares,
  logout,
} from "../controllers/auth.js";

const router = Router();

router.post("/logout", logout);

router.use("/", (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("../");
  } else {
    next();
  }
});

router.get("/login", renderLoginPage);
router.post("/login", loginMiddlewares);

router.get("/signup", renderSignUpPage);
router.post("/signup", validationAndSignUpMiddleware);

export default router;
