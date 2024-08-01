import passport from "passport";
import { Strategy } from "passport-local";
import { db } from "../db.js";
import bcrypt from "bcrypt";

passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const user = await db.users.getOfUsername(username);
      const invalidCredentialMsg = "Invalid username or password";
      if (!user) {
        done(null, null, { message: invalidCredentialMsg });
        return;
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        done(null, null, { message: invalidCredentialMsg });
      } else {
        const { id, username } = user;
        done(null, { id, username });
      }
    } catch (error) {
      done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.users.getHavingId(id);
    if (!user) {
      done(null, null);
      return;
    }
    done(null, { id, username: user.username });
  } catch (error) {
    done(error);
  }
});

export default passport;
