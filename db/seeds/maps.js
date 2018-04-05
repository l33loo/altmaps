exports.seed = function(knex, Promise) {
  return knex('maps').del()
    .then(function() {
      return Promise.all([
        knex('maps').insert({id: 1, created_by: 1, latitude: 48.4064791, longitude: -123.3735108, title: "I am a beach", description: "This is the first place I clicked"}),
        knex('maps').insert({id: 2, created_by: 2, latitude: 48.4335921, longitude: -123.3123138, title: "Willows Beach", description: "Awesome swimming!!1"}),
        knex('maps').insert({id: 3, created_by: 3, latitude: 48.463765, longitude: -123.280170, title: "Telegraph Cove", description: "So romantic! Awww"}),
        knex('maps').insert({id: 4, created_by: 4, latitude: 48.4555994, longitude: -123.350961, title: "Water Feature", description: "Surprise, it's not actually a beach! Do not swim in the water features!"}),
        knex('maps').insert({id: 5, created_by: 5, latitude: 48.4465182, longitude: -123.4077808, title: "That Beach on The Gorge", description: "Secluded Solitude, rewards await the adventurous swimmer"})
      ]);
    });
}
