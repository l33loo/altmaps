exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, first_name: 'Andrew'}),
        knex('users').insert({id: 2, first_name: 'Tess'}),
        knex('users').insert({id: 3, first_name: 'Lila'})
      ]);
    });
};
