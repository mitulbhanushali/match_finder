var mongoose =require("mongoose");
var Schema=mongoose.Schema;

var DOB=new Schema({

    dd:Number,
    mm:Number,
    yyyy:Number

});

var favourite=new Schema({

    movies:[String],
    celebrity:String,
    travelplaces:[String],
    foods:[String],

});

function validator(dob){

    if(dob.dd>=1 && dob.dd<=31){
        if(dob.mm>=1 && dob.mm<=12){
            if(((new Date()).getFullYear-dob.yyyy)>=18){
                return true;
            }
        }
    }
    return false;
}

var UserData=new Schema({
    Name:String, 
    userid:String,
    city:String,
    gender:String,
    hobbies:[String],
    movie:[String],
    music:[String],
    travelling:[String],
    book:[String],
    food:[String],
    sport:[String],
    bio:String,
    images:{type:Number,default:0},
    imageName:[String],
    profilepic:String,
    dob:{type:DOB,validate:[validator,"DOB is not proper"]}


});


var userdata=mongoose.model("userdata",UserData,"userdata");

module.exports=userdata;

