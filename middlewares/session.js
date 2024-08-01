import "dotenv/config";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { dbPool } from "../db.js";

const PgSessionStore = connectPgSimple(session);

const configuredSession = session({
  store: new PgSessionStore({
    pool: dbPool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});

export default configuredSession;
