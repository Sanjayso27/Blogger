const mongoose = require("mongoose");
// used to check whether the the email already exist or not
const uniqueValidator = require("mongoose-unique-validator");

const schema = mongoose.Schema;

const userSchema = new schema({
    name: {type:String,require:true},
    // this would just create the index for the mails,hence speeds up the querying process
    email: {type:String,require:true,unique:true},
    password: {type:String,require:true,minlength:6},
    image: {type:String,require:true},
    blogs: [{ type: mongoose.Types.ObjectId ,required:true,ref:'Blog'}],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);