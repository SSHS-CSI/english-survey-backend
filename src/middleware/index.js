const mongoose = require("mongoose");

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("DB connection established!");
    }
    catch (error) {
        console.error(error);
    }
})();

module.exports = {
    getDB: async (ctx, next) => {
        ctx.state.db = ctx.state.client.db("Survey_1");
        ctx.state.collection = {};
        ctx.state.collection.question = ctx.state.db.collection("question");
        ctx.state.collection.response = ctx.state.db.collection("response");
        await next();
    }
};