exports.seed = function(knex, Promise) {
  return knex('favorite_maps').del()
    .then(function () {
      return Promise.all([
        knex('favorite_maps').insert({id: 1, map_id: 1, user_id: 1}),
        knex('favorite_maps').insert({id: 2, map_id: 1, user_id: 2}),
        knex('favorite_maps').insert({id: 3, map_id: 1, user_id: 3})
      ]);
    });
};
