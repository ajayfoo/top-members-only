import { db } from "../db.js";

const render = async (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  const allPostTitlesAndDescriptions =
    await db.posts.getAllTitlesAndDescriptions();
  res.render("index/public", { posts: allPostTitlesAndDescriptions });
};

export { render };
