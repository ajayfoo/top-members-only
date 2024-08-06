import { body, validationResult } from "express-validator";
import auth from "../middlewares/auth.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import { db, dbPool } from "../db.js";

const goToHome = (req, res, next) => {
  res.redirect("../../");
};
const renderLoginPage = (req, res) => {
  res.render("login");
};

const login = (req, res, next) => {
  const configuredMiddleware = auth.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.render("login", { message: "Login failed" });
      return;
    }
    req.login(user, next);
  });
  configuredMiddleware(req, res, next);
};

const loginMiddlewares = [login, goToHome];

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("../");
  });
};

const renderSignUpPage = (req, res) => {
  console.log("render signup");
  res.render("signup", {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    passwordConfirm: "",
    errors: [],
  });
};

const usernameIsAvailable = async (username) => {
  const { rows } = await dbPool.query(
    `
    SELECT COUNT(*) AS occurrence FROM users WHERE username=$1
    `,
    [username]
  );
  console.log(rows[0]);
  return parseInt(rows[0].occurrence) === 0;
};

const validationMiddlewaresForSignUpFormFields = [
  body("first_name")
    .trim()
    .isLength({ min: 1, max: 60 })
    .withMessage("First name must be 1-60 characters long")
    .isAlpha()
    .withMessage("Only alphabets are allowed for first name"),
  body("last_name")
    .trim()
    .isLength({ min: 1, max: 60 })
    .withMessage("Last Name must be 1-60 characters long")
    .isAlpha()
    .withMessage("Only alphabets are allowed for last name"),
  body("username")
    .trim()
    .isLength({ min: 3, max: 35 })
    .withMessage("Username must be 3-35 characters long")
    .isAlphanumeric()
    .withMessage("Only alphabets and 0-9 are allowed for username"),
  body("password")
    .isLength({ min: 8, max: 128 })
    .withMessage("Passsword must be 8-128 characters long")
    .isStrongPassword({
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "At least one lowercase and uppercase alphabet, number and symbol must be present in your password"
    ),
  body("password_confirm")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Confirmation password doesn't match with original password")
    .bail(),
  body("username")
    .custom(async (value) => {
      const isAvailable = await usernameIsAvailable(value);
      return isAvailable;
    })
    .withMessage("Username not available"),
];

const handleValidationErrors = (req, res, next) => {
  const { errors } = validationResult(req);
  if (errors.length != 0) {
    console.log(errors);
    const { first_name, last_name, username, password, password_confirm } =
      req.body;
    res.render("signup", {
      firstName: first_name,
      lastName: last_name,
      username,
      password,
      passwordConfirm: password_confirm,
      errors,
    });
  } else {
    next();
  }
};

const validationAndSignUpMiddleware = [
  ...validationMiddlewaresForSignUpFormFields,
  handleValidationErrors,
  async (req, res, next) => {
    const { first_name, last_name, username, password } = req.body;
    console.log(password);
    console.log(process.env.BCRYPT_SALT_ROUNDS);
    try {
      const passwordHash = await bcrypt.hash(
        password,
        parseInt(process.env.BCRYPT_SALT_ROUNDS)
      );
      await db.users.insert(first_name, last_name, username, passwordHash);
      next();
    } catch (err) {
      next(err);
    }
  },
  ...loginMiddlewares,
];

export {
  renderLoginPage,
  loginMiddlewares,
  logout,
  renderSignUpPage,
  validationAndSignUpMiddleware,
};
