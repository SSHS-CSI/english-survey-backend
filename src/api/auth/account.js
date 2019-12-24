const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const Account = new Schema({
    profile: {
        userName: String,
        type: Number
    },
    hasResponsed: Boolean,
    password: String,
    hashedPassword: String
});

Account.statics.register = (userName, type) => {
    const password = crypto.randomBytes(10).toString("hex");
    const account = new this({
        profile: {
            userName: userName,
            type: type
        }, 
        hasResponsed: false,
        password: password,
        hashedPassword: bcrypt.hash(password, process.env.SALT)
    });

    return account.save();
};

/*
Account.statics.findUserName = (userName) => {
    return this.findOne({userName: userName}).exec();
};

Account.statics.validatePassword = (userName, password) => {
    const account = this.findOnew({userName: userName}).exec();
    bcrypt.compare(password, account.password, (err, res) => {
        if(err) {
            throw(err);
        }
        return res;
    })
}
*/

module.exports = mongoose.model("Account", Account);
