exports.seed = function(knex, Promise) {
  return knex('maps').del()
    .then(function () {
      return Promise.all([
        knex('maps').insert({id: 1, created_by: 1, title: 'foo', description: 'foo'}),
      ]);
    });
};
