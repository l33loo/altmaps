exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('public').table('map_pins', function(table) {
      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('public').table('map_pins', function(table) {
      table.dropColumn('created_at');
      table.dropColumn('updated_at');
    })
  ]);
};
