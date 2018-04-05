exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('public').createTable('maps', function(table) {
      table.increments();
      table.integer('creator_user_id').unsigned();
      table.foreign('creator_user_id').references('users.id');
      table.string('title');
      table.string('category');
      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('maps')
  ])
};
