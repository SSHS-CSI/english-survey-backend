const MongoClient = require("mongodb").MongoClient;

let client = null;
(async () => {
    client = await MongoClient.connect(process.env.MONGO_URI, {
        useUnifiedTopology: true
    });
    console.log("DB connection established!");
})();

module.exports = {
    getDB: async (ctx, next) => {
        ctx.state.client = client;
        ctx.state.db = client.db("Survey_1");
        ctx.state.collection = {};
        ctx.state.collection.question = ctx.state.db.collection("question");
        ctx.state.collection.response = ctx.state.db.collection("response");
        ctx.state.collection.account = ctx.state.db.collection("account");
        await next();
    }
};
