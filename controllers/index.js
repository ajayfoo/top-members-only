import { db } from "../db.js";

const render = async (req, res) => {
  const {
    passport: { user },
  } = req.session;
  const [isUnverified, allPosts, allPostTitlesAndDescriptions] =
    await Promise.all([
      db.users.isUnverified(user),
      db.posts.getAll(),
      db.posts.getAllTitlesAndDescriptions(),
    ]);
  if (isUnverified) {
    res.render("index/unverified", { posts: allPostTitlesAndDescriptions });
  } else {
    res.render("index", allPosts);
  }
};

const insertPost = async (req, res) => {
  const { title, description } = req.body;
  const {
    passport: { user },
  } = req.session;
  try {
    await db.posts.insert(title, description, user);
    res.status(200).end();
  } catch (err) {
    res.status(500).end();
  }
};

export { render, insertPost };
