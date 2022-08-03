This is a back end news server providing articles, comments and users through various endpoints.

The app is hosted on Heroku at the following address:

https://as-nc-news.herokuapp.com/api

Thius address provides details for all endpoints.

To clone the repo:

- visit the gitHub repo:
  https://github.com/sheffieldAndrew/as-news-backend
- Fork the repo
- Copy the CODE for the forked repo
- Create a new working diretory in your code editor
- Clone the repo - git clone <forked repo code>
- Install dependencies - npm i
- create two .env files for the project
- In the root folder create a .env folder. inside this folder files
  .env.dev
  containing the following information
  PGDATABASE=nc_news
  PGUSER=your username (ubtunu only)
  PGPASSWORD=your password (ubuntu only)

  .env.test
  containing the following information
  PGDATABASE=nc_news_test
  PGUSER=your username (ubtunu only)
  PGPASSWORD=your password (ubuntu only)

From here run the seeding scripts to get started

- npm run setup-dbs
- npm run seed

Minimum versions - run v16.16.0 or later of Node.js and 14.4 or later of PSQL.
