/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").unsigned().primary();
    table.string("username", 24).unique().notNullable();
  });

  await knex("users").insert([
    { username: "tlhunter" },
    { username: "AliNisarAhmed" },
    { username: "AzlanAli" },
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  knex.schema.dropTable("users");
};
