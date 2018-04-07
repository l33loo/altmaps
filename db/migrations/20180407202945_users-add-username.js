exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('public').table('users', function(table) {
      table.string('username')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('public').table('users', function(table) {
      table.dropColumn('username')
    })
  ])
};
