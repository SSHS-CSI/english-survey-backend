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
    },
    requireAuth: async (ctx, next) => {
        if(ctx.session.isNew) {
            console.log("[debug]: ctx.session = ", ctx.session);
            console.log("[debug]: ctx.session.id = ", ctx.session.id);
            ctx.error(401, "unauthorized");
        } else if(!ctx.session.id) {
            console.log("[debug]: ctx.session = ", ctx.session);
            console.log("[debug]: ctx.session.isNew = ", ctx.session.isNew);
            ctx.error(401, "unauthorized");
        }

        await next();
    }
};
