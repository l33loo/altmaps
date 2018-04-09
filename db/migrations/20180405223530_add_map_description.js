exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('public').table('maps', function(table) {
      table.text('description');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('public').table('maps', function(table) {
      table.dropColumn('description');
    })
  ]);
};
