import sql from "./db.js";

const createTableVideos = async () => {
  try {
    return await sql`
        create table if not exists videos(
            id TEXT PRIMARY KEY,
            title TEXT,
            description TEXT,
            duration INTEGER
        )
        `.then(() => {
      console.log(`TABLE CREATED!`);
    });
  } catch (error) {
    return new Error(error.message);
  }
};

// eslint-disable-next-line no-unused-vars
const deleteTable = async (name) => {
  try {
    return sql`
            drop table if exists ${sql(name)}
            
        `.then(() => {
      console.log(`TABLE ${name} DELETED!`);
    });
  } catch (error) {
    return new Error(error.message);
  }
};

// deleteTable('videos');

createTableVideos();
