exports.seed = function(knex, Promise) {
  return knex('favorite_maps').del()
    .then(function () {
      return Promise.all([
        knex('favorite_maps').insert({id: 1, map_id: 1, user_id: 2}),
        knex('favorite_maps').insert({id: 2, map_id: 2, user_id: 3}),
        knex('favorite_maps').insert({id: 3, map_id: 3, user_id: 1}),
        knex('favorite_maps').insert({id: 4, map_id: 4, user_id: 2}),
        knex('favorite_maps').insert({id: 5, map_id: 5, user_id: 3}),
        knex('favorite_maps').insert({id: 6, map_id: 1, user_id: 1}),
        knex('favorite_maps').insert({id: 7, map_id: 2, user_id: 2}),
        knex('favorite_maps').insert({id: 8, map_id: 3, user_id: 3}),
        knex('favorite_maps').insert({id: 9, map_id: 4, user_id: 1}),
        knex('favorite_maps').insert({id: 10, map_id: 5, user_id: 2})
      ]);
    });
};
