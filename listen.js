const app = require('./app');

const PORT = process.env.PORT || 5432

app.listen(PORT, () => console.log(`Listening on ${PORT}...`))