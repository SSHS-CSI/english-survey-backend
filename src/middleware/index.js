const { MongoClient, ObjectID } = require("mongodb");
const compose = require("koa-compose");

let client = null;
(async () => {
    client = await MongoClient.connect(process.env.MONGO_URI, {
        useUnifiedTopology: true
    });
    console.log("DB connection established!");
})();

const getDB = async (ctx, next) => {
    ctx.state.client = client;
    ctx.state.db = client.db("Survey_1");
    ctx.state.collection = {};
    ctx.state.collection.account = ctx.state.db.collection("account");
    await next();
};

const requireAuth = async (ctx, next) => {
    if(ctx.session.isNew) {
        ctx.error(401, "unauthorized");
    }

    await next();
};

// implicitly assuming getDB is already called beforehand
const requireAdmin =  compose([requireAuth, async (ctx, next) => {
    const result = await ctx.state.collection.account.findOne({
        _id: new ObjectID(ctx.session.id)
    });

    // if not admin
    if(result.type !== 0) {
        ctx.error(401, "unauthorized");
    }

    await next();
}]);

module.exports = {
    getDB,
    requireAuth,
    requireAdmin
};
