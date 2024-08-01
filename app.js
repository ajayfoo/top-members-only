import express from "express";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import configuredSession from "./middlewares/session.js";
import auth from "./middlewares/auth.js";
import loginRouter from "./routes/auth.js";
import indexRouter from "./routes/index.js";
import "dotenv/config";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(configuredSession);
app.use(auth.session());

app.use("/auth", loginRouter);

app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/auth/login");
  }
});

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(process.env.PORT, () => {
  console.log("Listening on PORT: " + process.env.PORT);
});
