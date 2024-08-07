import { body } from "express-validator";
import { db, dbPool } from "../db.js";
import createHttpError from "http-errors";

const render = async (req, res, next) => {
  const {
    passport: { user: userId },
  } = req.session;
  const [user, memberTypesMap, allPosts, allPostTitlesAndDescriptions] =
    await Promise.all([
      db.users.getUser(userId),
      db.users.getMemberTypesMap(),
      db.posts.getAll(),
      db.posts.getAllTitlesAndDescriptions(),
    ]);
  const username = user.username;
  switch (user.member_type_id) {
    case memberTypesMap.UNVERIFIED: {
      res.render("index/unverified", {
        username,
        posts: allPostTitlesAndDescriptions,
      });
      return;
    }
    case memberTypesMap.GENERAL: {
      res.render("index/verified", {
        username,
        posts: allPosts,
        isAdmin: false,
      });
      return;
    }
    case memberTypesMap.ADMIN: {
      res.render("index/verified", {
        username,
        posts: allPosts,
        isAdmin: true,
      });
      return;
    }
    default: {
      next(createHttpError(500));
    }
  }
};

function formatDate(value) {
  let date = new Date(value);
  const day = date.toLocaleString("default", { day: "2-digit" });
  const month = date.toLocaleString("default", { month: "2-digit" });
  const year = date.toLocaleString("default", { year: "2-digit" });
  return day + "." + month + "." + year;
}

const insertPost = async (req, res) => {
  const { title, description } = req.body;
  const {
    passport: { user },
  } = req.session;
  try {
    const [, { rows }] = await Promise.all([
      db.posts.insert(title, description, user),
      dbPool.query("SELECT username FROM users WHERE id=$1", [user]),
    ]);
    res.json({
      username: rows[0].username,
      timestamp: formatDate(Date.now()),
    });
  } catch (err) {
    res.status(500).end();
  }
};

const validateAndInsertPostMiddlewares = [
  body("title")
    .isLength({ min: 1, max: 25 })
    .withMessage("Title must be no more than 25 characters"),
  body("description")
    .isLength({ min: 1, max: 360 })
    .withMessage("Description must be no more than 360 characters"),
  insertPost,
];

const join = async (req, res) => {
  const { passcode } = req.body;
  const {
    passport: { user },
  } = req.session;
  const currentPasscode = await db.passcode.getForGeneral();
  if (currentPasscode === passcode) {
    await db.users.changeMemberStatusToGeneral(user);
    res.status(200).end();
  } else {
    res.status(401).end();
  }
};
const validateAndJoinMiddlewares = [
  body("passcode").isLength({ min: 1, max: 50 }),
  join,
];

const becomeAdmin = async (req, res) => {
  const { passcode } = req.body;
  const {
    passport: { user },
  } = req.session;
  const currentPasscode = await db.passcode.getForAdmin();
  if (currentPasscode === passcode) {
    await db.users.changeMemberStatusToAdmin(user);
    res.status(200).end();
  } else {
    res.status(401).end();
  }
};

const validateAndBecomeAdminMiddlewares = [
  body("passcode").isLength({ min: 1, max: 50 }),
  becomeAdmin,
];

const deletePost = async (req, res) => {
  const { id } = req.body;
  try {
    await db.posts.delete(id);
    res.status(200).end();
  } catch (err) {
    res.status(500).end();
  }
};

export {
  render,
  validateAndInsertPostMiddlewares,
  validateAndJoinMiddlewares,
  validateAndBecomeAdminMiddlewares,
  deletePost,
};
