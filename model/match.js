var mongoose =require("mongoose");
var Schema=mongoose.Schema;


var Match=new Schema({

    userid:String,
    Matches:[String],
    MatchreqSend:[String],
    MatchreqRec:[String]


});

var MatchModel=mongoose.model("match",Match,"match");


module.exports=MatchModel;