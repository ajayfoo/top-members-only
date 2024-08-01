import auth from "../middlewares/auth.js";

const renderLoginPage = (req, res, next) => {
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

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("../");
  });
};

const renderSignUpPage = (req, res, next) => {
  res.render("signup");
};

export { renderLoginPage, login, logout, renderSignUpPage };
