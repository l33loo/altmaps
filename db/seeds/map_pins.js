exports.seed = function(knex, Promise) {
  return knex('map_pins').del()
    .then(function() {
      return Promise.all([
        knex('map_pins').insert({id: 1, map_id: 1, created_by: 1, latitude: 48.4064791, longitude: -123.3735108, title: "I am a beach", description: "This is the first place I clicked"}),
        knex('map_pins').insert({id: 2, map_id: 1, created_by: 2, latitude: 48.4335921, longitude: -123.3123138, title: "Willows Beach", description: "Awesome swimming!!1"}),
        knex('map_pins').insert({id: 3, map_id: 1, created_by: 3, latitude: 48.463765, longitude: -123.280170, title: "Telegraph Cove", description: "So romantic! Awww"}),
        knex('map_pins').insert({id: 4, map_id: 1, created_by: 1, latitude: 48.4555994, longitude: -123.350961, title: "Water Feature", description: "Surprise, it's not actually a beach! Do not swim in the water features!"}),
        knex('map_pins').insert({id: 5, map_id: 1, created_by: 2, latitude: 48.4465182, longitude: -123.4077808, title: "That Beach on The Gorge", description: "Secluded Solitude, rewards await the adventurous swimmer"})
      ]);
    });
}
