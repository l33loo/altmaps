
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('public').createTable('map_pins', function(table) {
      table.increments();
      table.integer('created_by').unsigned();
      table.foreign('created_by').references('users.id');
      table.integer('map_id').unsigned();
      table.foreign('map_id').references('maps.id');
      table.string('place_id');
      table.string('latitude');
      table.string('longitude');
      table.string('title');
      table.text('description');
      table.string('category');
      table.string('color');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('map_pins')
  ]);
};
