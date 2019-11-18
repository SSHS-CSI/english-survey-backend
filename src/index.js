const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const Koa = require('koa');
const session = require('koa-session');

const api = require("./api");

const app = new Koa();
const PORT = process.env.PORT || 8000;

app.use(session(app));
app.use(api.routes());
app.use(api.allowedMethods());

const server = app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

module.exports = server;