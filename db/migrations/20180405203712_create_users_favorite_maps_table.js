
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('public').createTable('favorite_maps', function(table){
      table.increments();
      table.integer('map_id').unsigned();
      table.foreign('map_id').references('maps.id');
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('users.id');
      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('favorite_maps')
  ])
};
