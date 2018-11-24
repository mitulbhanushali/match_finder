var mongoose=require("mongoose");
var Schema=mongoose.Schema;

var loginModel=new Schema({

    username:String,
    password:String

});



var Login=mongoose.model('login',loginModel,"user");

module.exports=Login;