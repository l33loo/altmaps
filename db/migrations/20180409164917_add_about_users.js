exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('public').table('users', function(table) {
      table.text('about');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('public').table('map_pins', function(table) {
      table.dropColumn('about');
    })
  ])
};
