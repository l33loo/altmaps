exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.withSchema('public').createTable('maps', function(table) {
      table.increments();
      table.integer('created_by').unsigned();
      table.foreign('created_by').references('users.id');
      table.string('title');
      table.string('category');
      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('maps')
  ]);
};
