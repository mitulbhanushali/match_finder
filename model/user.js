var mongoose=require("mongoose");
var Schema=mongoose.Schema;


UserModel=new Schema({

    username:String,
    password:String,
    name:String ,
    created_at:{type:Date,default:Date.now}
});

var User=mongoose.model("user",UserModel,"user");

module.exports=User;