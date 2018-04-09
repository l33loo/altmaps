# Altmaps

Altmaps is an application that allows users to create maps collaboratively and share these maps with the world!

This project served as practice with full-stack development. For now, registered users are authenticated with their email only (not passwords).

## Features

1. Maps can contain pins that include information about the location.
2. All users can see the maps.
3. Authenticated users can favorite, create, and edit maps.
4. Registered users have profiles that indicate their favourite maps and the maps they've contributed to.

## Final Product
!["Splash Screen"](https://github.com/thelornenelson/altmaps/blob/master/docs/main-splash.png)
!["Map Listing"](https://github.com/thelornenelson/altmaps/blob/master/docs/map-listing.png)
!["Map detailed view"](https://github.com/thelornenelson/altmaps/blob/master/docs/map-pins-view.png)
!["Editing pin"](https://github.com/thelornenelson/altmaps/blob/master/docs/map-edit-pin.png)
!["User Profile"](https://github.com/thelornenelson/altmaps/blob/master/docs/user-profile.png)

## Getting Started

1. Clone this repository.
2. Install dependencies using the `npm install` command.
3. Create a new postgresql database make sure there is a correctly configured `.env` file in the root project folder. Example file `.env.example` is included for reference.
4. Create database schema by running `knex migrate:latest`
5. Populate database with seed data by running `knex seed:run`
6. Start the web server using the `npm run local` command. The app will be served at <http://localhost:8080/>.
7. Go to <http://localhost:8080/> in your browser.

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above
- Bcrypt 2.0.0 or above
- Body-parser 1.15.2 or above
- Cookie-session 2.0.0-beta.3 or above
- Dotenv 2.0.0 or above
- Ejs 2.4.1 or above
- Express 4.13.4 or above
- Knex 0.11.10 or above
- Knex-logger 0.1.0 or above
- Morgan 1.7.0 or above
- Node-sass-middleware 0.9.8 or above
- Pg 6.0.2 of above
- Semantic-ui 2.3.1 or above
