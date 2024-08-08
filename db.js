import "dotenv/config";
import pg from "pg";

const dbPool = new pg.Pool({
  connectionString: process.env.DATABASE_CONNECTION_STRING,
});

const db = {
  posts: {
    getAllTitlesAndDescriptions: async () => {
      const { rows } = await dbPool.query(
        "SELECT id, title, description FROM posts"
      );
      return rows;
    },
    getAll: async () => {
      const { rows } = await dbPool.query(`
        SELECT posts.id, username, TO_CHAR(posted_at,'DD.MM.YY') AS posted_at, title, description
        FROM posts INNER JOIN users ON user_id=users.id`);
      return rows;
    },
    insert: (title, description, userId) =>
      dbPool.query(
        `INSERT INTO posts(title,description,user_id) VALUES($1,$2,$3)
        RETURNING id,posted_at AS timestamp
        `,
        [title, description, userId]
      ),
    delete: (id) =>
      dbPool.query(
        `
          DELETE FROM posts WHERE id=$1
          `,
        [id]
      ),
  },
  passcode: {
    getForGeneral: async () => {
      const GENERAL = "GENERAL";
      const { rows } = await dbPool.query(
        `
        SELECT passcode FROM passcodes
        WHERE member_type_id=(SELECT id FROM member_types WHERE name=$1)
        LIMIT 1
        `,
        [GENERAL]
      );
      return rows[0].passcode;
    },
    getForAdmin: async () => {
      const ADMIN = "ADMIN";
      const { rows } = await dbPool.query(
        `
        SELECT passcode FROM passcodes
        WHERE member_type_id=(SELECT id FROM member_types WHERE name=$1)
        LIMIT 1
        `,
        [ADMIN]
      );
      return rows[0].passcode;
    },
  },
  users: {
    getHavingId: async (id) => {
      const { rows } = await dbPool.query("SELECT * FROM users WHERE id=$1", [
        id,
      ]);
      return rows[0];
    },
    getOfUsername: async (username) => {
      const { rows } = await dbPool.query(
        "SELECT * FROM users WHERE username=$1",
        [username]
      );
      return rows[0];
    },
    insert: (firstName, lastName, username, password) => {
      return dbPool.query(
        "INSERT INTO users(first_name,last_name,username,password) VALUES($1,$2,$3,$4)",
        [firstName, lastName, username, password]
      );
    },
    isUnverified: async (userId) => {
      const UNVERIFIED = "UNVERIFIED";
      const { rows } = await dbPool.query(
        `SELECT member_type_id FROM users AS u
        INNER JOIN member_types AS mtype ON (u.member_type_id=mtype.id
        AND u.id=$1 AND mtype.name=$2)`,
        [userId, UNVERIFIED]
      );
      return rows.length === 1;
    },
    getUser: async (userId) => {
      const { rows } = await dbPool.query(
        `SELECT * FROM users
        WHERE id=$1`,
        [userId]
      );
      return rows[0];
    },
    getMemberTypesMap: async () => {
      const { rows } = await dbPool.query(`
        SELECT * FROM member_types`);
      return rows.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.id }), {});
    },
    changeMemberStatusToGeneral: (userId) => {
      const GENERAL = "GENERAL";
      return dbPool.query(
        `UPDATE users SET member_type_id=(
          SELECT id FROM member_types WHERE name=$1)
        WHERE id=$2`,
        [GENERAL, userId]
      );
    },
    changeMemberStatusToAdmin: (userId) => {
      const ADMIN = "ADMIN";
      return dbPool.query(
        `UPDATE users SET member_type_id=(
          SELECT id FROM member_types WHERE name=$1)
        WHERE id=$2`,
        [ADMIN, userId]
      );
    },
  },
};

export { dbPool, db };
