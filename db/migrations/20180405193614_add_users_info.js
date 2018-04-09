
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('public').table('users', function(table) {
      table.renameColumn('name', 'first_name');
      table.string('last_name');
      table.string('email');
      table.string('password_hash');
      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function(table) {
      table.renameColumn('first_name', 'name');
      table.dropColumn('last_name');
      table.dropColumn('email');
      table.dropColumn('password_hash');
      table.dropTimestamps();
    })
  ])
};
