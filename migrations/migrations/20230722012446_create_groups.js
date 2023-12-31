/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`
    CREATE TABLE groups (
      id SERIAL PRIMARY KEY,
      name VARCHAR(24) UNIQUE NOT NULL)
    `);

  await knex.raw(
    `INSERT INTO groups (id, name) VALUES
    (1, 'Basic'), (2, 'Mods'), (3, 'Admins')`
  );

  await knex.raw(`ALTER TABLE users ADD COLUMN
      group_id INTEGER NOT NULL REFERENCES groups (id) DEFAULT 1`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`ALTER TABLE users DROP COLUMN group_id`);
  await knex.raw(`DROP TABLE groups`);
};
