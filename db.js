import "dotenv/config";
import pg from "pg";

const dbPool = new pg.Pool({
  connectionString: process.env.DATABASE_CONNECTION_STRING,
});

const getFormattedInstrumentRows = (rows) =>
  rows.map((r) => {
    const {
      id,
      name,
      description,
      price,
      count,
      img_url,
      category_id,
      category_name,
      category_description,
    } = r;
    return {
      id,
      name,
      description,
      price,
      count,
      imgUrl: img_url,
      category: {
        id: category_id,
        name: category_name,
        description: category_description,
      },
    };
  });

const getNFieldsValues = (start, n) => {
  const end = n + start;
  let fieldsValues = "(";
  for (let i = start; i < end; ++i) {
    fieldsValues += "$" + i;
    if (i !== end - 1) {
      fieldsValues += ",";
    }
  }
  fieldsValues += ")";
  return fieldsValues;
};

const getNValuesClauses = (n, numOfFields) => {
  let valuesClauses = "VALUES";
  const totalNumOfFields = n * numOfFields;
  for (let i = 1; i <= totalNumOfFields; i += numOfFields) {
    valuesClauses += getNFieldsValues(i, numOfFields);
    valuesClauses += ",";
  }
  valuesClauses = valuesClauses.slice(0, valuesClauses.length - 1);
  return valuesClauses;
};

const db = {
  categories: {
    getAll: async () => {
      const { rows } = await dbPool.query("SELECT * FROM categories");
      return rows;
    },
    getHavingId: async (id) => {
      const { rows } = await dbPool.query(
        "SELECT * FROM categories WHERE id=$1",
        [id]
      );
      return rows[0];
    },
    getHavingIds: async (ids) => {
      const { rows } = await dbPool.query(
        "SELECT * FROM categories WHERE id=ANY($1::int[])",
        [ids]
      );
      return rows;
    },
    insert: (name, description) => {
      return dbPool.query(
        "INSERT INTO categories(name,description) VALUES($1,$2)",
        [name, description]
      );
    },
    updateMultiple: async (updatedCategoriesMap) => {
      const numOfFields = 3;
      const numOfCategoriesToUpdate = Object.keys(updatedCategoriesMap).length;
      const formattedValues = Object.values(updatedCategoriesMap)
        .map((c) => {
          const values = Object.values(c);
          values[0] = parseInt(values[0]);
          return values;
        })
        .flat(1);
      return dbPool.query(
        `
        WITH update_values(id,name,description) AS(
        ${getNValuesClauses(numOfCategoriesToUpdate, numOfFields)}
        )
        UPDATE categories
        SET name=u.name, description=u.description FROM update_values AS u
        WHERE categories.id=u.id::int
        `,
        [...formattedValues]
      );
    },
    removeHavingIds: (ids) => {
      return dbPool.query("DELETE FROM categories WHERE id=ANY($1::int[])", [
        ids,
      ]);
    },
  },
  instruments: {
    getAll: async () => {
      const { rows } = await dbPool.query(
        `
        SELECT i.id, i.name, i.description, i.price, i.count, i.img_url, i.category_id,
          c.name AS category_name, c.description AS category_description
        FROM instruments AS i
        INNER JOIN categories AS c ON c.id=i.category_id
        `
      );
      return getFormattedInstrumentRows(rows);
    },
    getHavingId: async (id) => {
      const { rows } = await dbPool.query(
        `
        SELECT i.id, i.name, i.description, i.price, i.count, i.img_url, i.category_id,
          c.name AS category_name, c.description AS category_description
        FROM instruments AS i
        INNER JOIN categories AS c ON c.id=i.category_id
        WHERE i.id=$1::int
        `,
        [id]
      );
      return getFormattedInstrumentRows(rows)[0];
    },
    getHavingIds: async (ids) => {
      const { rows } = await dbPool.query(
        `
        SELECT i.id, i.name, i.description, i.price, i.count, i.img_url, i.category_id,
          c.name AS category_name, c.description AS category_description
        FROM instruments AS i
        INNER JOIN categories AS c ON c.id=i.category_id
        WHERE id=ANY($1)
        `,
        [ids]
      );
      return getFormattedInstrumentRows(rows);
    },
    getHavingCategoryIds: async (categoryIds) => {
      const { rows } = await dbPool.query(
        `
        SELECT i.id, i.name, i.description, i.price, i.count, i.img_url, i.category_id,
          c.name AS category_name, c.description AS category_description
        FROM instruments AS i
        INNER JOIN categories AS c ON c.id=i.category_id
        WHERE i.category_id=ANY($1)
        `,
        [categoryIds]
      );
      return getFormattedInstrumentRows(rows);
    },
    insert: async (instrument) => {
      const { name, description, price, count, imgUrl, category_id } =
        instrument;
      return await dbPool.query(
        `
        INSERT INTO instruments(name,description,price,count,img_url,category_id)
        VALUES($1,$2,$3,$4,$5,$6)
        `,
        [name, description, price, count, imgUrl, category_id]
      );
    },
    removeHavingId: (id) => {
      return dbPool.query("DELETE FROM instruments WHERE id=$1::int", [id]);
    },
  },
  posts: {
    getAllTitlesAndDescriptions: async () => {
      const { rows } = await dbPool.query(
        "SELECT title, description FROM posts"
      );
      return rows;
    },
    getAll: async () => {
      const { rows } =
        await dbPool.query(`SELECT username, TO_CHAR(posted_at,'DD.MM.YY') AS posted_at, title, description
        FROM posts INNER JOIN users ON user_id=users.id`);
      return rows;
    },
    insert: (title, description, userId) =>
      dbPool.query(
        "INSERT INTO posts(title,description,user_id) VALUES($1,$2,$3)",
        [title, description, userId]
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
