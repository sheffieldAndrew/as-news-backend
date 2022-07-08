const app = require('./app');

const  PORT = 5432

app.listen(PORT, () => console.log(`Listening on ${PORT}...`))