exports.seed = function(knex, Promise) {
  return knex.raw('TRUNCATE favorite_maps, map_pins, maps, users RESTART IDENTITY CASCADE;')
    .then(function () {
      return Promise.all([
        knex('users').insert({first_name: 'Andrew', email: 'andrew@andrew.andrew', username: 'theLorneNelson'}),
        knex('users').insert({first_name: 'Tess', email: 'tess@tess.tess', username: 'tesstess'}),
        knex('users').insert({first_name: 'Lila', email: 'lila@lila.lila', username: 'l33loo'}),
        knex('users').insert({first_name: 'Bob', email: 'bob@bob.bob', username: 'MrBob'}),
        knex('users').insert({first_name: 'Betty', email: 'betty@betty.betty', username: 'MsBoop'})
      ]);
    })
    .then(function () {
      return Promise.all([
        knex('maps').insert([{created_by: 1, title: 'Map One', description: 'One is the Loneliest Number'},
        {created_by: 1, title: 'Cool Beaches', description: 'And other interesting oceanside features.'},
        {created_by: 2, title: 'Victoria Coffee Spots', description: 'Where are the best places for coffee?'},
        {created_by: 3, title: 'Indian Adventure', description: 'Adventure awaits!'}])
      ]);
    })
    .then(function () {
      return Promise.all([
        knex('favorite_maps').insert({map_id: 1, user_id: 1}),
        knex('favorite_maps').insert({map_id: 1, user_id: 2}),
        knex('favorite_maps').insert({map_id: 1, user_id: 3}),
        knex('favorite_maps').insert({map_id: 2, user_id: 2}),
        knex('favorite_maps').insert({map_id: 3, user_id: 3}),
        knex('favorite_maps').insert({map_id: 4, user_id: 3}),
        knex('favorite_maps').insert({map_id: 4, user_id: 2})
      ]);
    })
    .then(function() {
      return Promise.all([
        knex('map_pins').insert({map_id: 1, created_by: 5, latitude: 48.4064791, longitude: -123.3735108, title: "I am a beach", description: "This is the first place I clicked."}),
        knex('map_pins').insert({map_id: 1, created_by: 5, latitude: 48.4335921, longitude: -123.3123138, title: "Willows Beach", description: "Awesome swimming!!!"}),
        knex('map_pins').insert({map_id: 1, created_by: 3, latitude: 48.463765, longitude: -123.280170, title: "Telegraph Cove", description: "So romantic! Awww."}),
        knex('map_pins').insert({map_id: 1, created_by: 1, latitude: 48.4555994, longitude: -123.350961, title: "Water Feature", description: "Surprise, it's not actually a beach! Do not swim in the water features!"}),
        knex('map_pins').insert({map_id: 1, created_by: 2, latitude: 48.4465182, longitude: -123.4077808, title: "That Beach on The Gorge", description: "Secluded Solitude, rewards await the adventurous swimmer."}),
        knex('map_pins').insert({map_id: 2, created_by: 3, latitude: 48.5723900, longitude: -123.36697, title: "Island View Beach", description: "Excellent spot for a slightly longer stroll with good views."}),
        knex('map_pins').insert({map_id: 2, created_by: 1, latitude: 49.0129200, longitude: -123.58588, title: "Porlier Pass", description: "Good diving off Galiano."}),
        knex('map_pins').insert({map_id: 2, created_by: 2, latitude: 48.3000000, longitude: -123.533333, title: "Race Rocks", description: "Diverse Invertebrate Life & Rugged Topside Scenery."}),
        knex('map_pins').insert({map_id: 2, created_by: 3, latitude: 48.4147800, longitude: -123.385600, title: "Ogden Point Breakwater", description: "Be gentle with the sea cucumbers!"}),
        knex('map_pins').insert({map_id: 2, created_by: 1, latitude: 49.5176000, longitude: -124.5767800, title: "Flora Islet Light Dive Site", description: "Dramatic dropoff; sometimes home to six-gill sharks."}),
        knex('map_pins').insert({map_id: 3, created_by: 2, latitude: 48.4278458, longitude: -123.3713490, title: "Hey Happy", description: "Choice of two types of espresso. Good presentation."}),
        knex('map_pins').insert({map_id: 3, created_by: 4, latitude: 48.432082, longitude: -123.3671957, title: "Discovery Coffee", description: "Nice creama, high quality presentation, aromatic."}),
        knex('map_pins').insert({map_id: 3, created_by: 1, latitude: 48.4304080, longitude: -123.3472156, title: "Fernwood Coffee", description: "Excellent atmostphere, good local roastery."}),
        knex('map_pins').insert({map_id: 3, created_by: 2, latitude: 48.4152542, longitude: -123.3580837, title: "Moka House", description: "Great location for longer cafe stays."}),
        knex('map_pins').insert({map_id: 3, created_by: 4, latitude: 48.4286317, longitude: -123.3698819, title: "Habit Coffee", description: "Fantastic coffee order categorization system!"}),
        knex('map_pins').insert({map_id: 4, created_by: 4, latitude: 26.8849344, longitude: 75.5103745, title: "Jaipur, Rajasthan", description: "Capital of Rajasthan; location of the 'Pink City."}),
        knex('map_pins').insert({map_id: 4, created_by: 5, latitude: 24.6082214, longitude: 73.5669747, title: "Udaipur, Rajasthan", description: "Formerly known as the capital of the Mewar Kingdom."}),
        knex('map_pins').insert({map_id: 4, created_by: 3, latitude: 26.4866459, longitude: 74.511348, title: "Pushkar", description: "Borders the Thar Desert; home to hundreds of temples."}),
        knex('map_pins').insert({map_id: 4, created_by: 1, latitude: 24.9048206, longitude: 74.5515543, title: "Chittorgarh", description: "Very intricate architecture; consists primarily of sandstone and marble."}),
        knex('map_pins').insert({map_id: 4, created_by: 2, latitude: 26.455216, longitude: 74.6229571, title: "Dhai Din Ka Jhonpra", description: "One of India's oldest Mosques dating from the 1190s."})
      ]);
    });
};
