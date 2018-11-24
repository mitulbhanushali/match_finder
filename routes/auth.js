var router=require('express').Router();
var User=require("../model/user");  // This is user model which handle basic user data like useranme,password,name and created datetime
var UserData=require("../model/userdata");  // This model is use for handling details of user like dob,hobbies and etc...
var mongoose =require("mongoose");


/*
    full path :- /auth/login
    Below router method is use for login purpose 
    & take username and password as request parameter 
    & send Json message 

*/

router.post("/login",(req,res)=>{
   // console.log("request arrives"+req.body.username);
    User.findOne({$and:[{username:req.body.username},{password:req.body.password}]}).then((user)=>{
      //  console.log(user.username);
            if(user){
                var sucess={
                    statuscode:200,
                    message:"user found",
                    id:user._id


                };
                res.write(JSON.stringify(sucess));
            }else{
                var err={
                    statuscode:404,
                    message:"user not found"


                };
                res.write(JSON.stringify(err));
            }

            res.end();
    });


});


/*

    Full Path:- /auth/signup

    This router mdethod takes username,password & name as request and 
    check user is already exists or not and if user does not exist then 
    create new User then create user entry in userdata collection and 
    return JSON message with status code ,message and userid



*/


router.post("/signup",(req,res)=>{

    User.findOne({username:req.body.username}).then((alreadyuser)=>{

        if(alreadyuser){
            var err={
                statuscode:403,
                message:"username already exits"


            };
            res.end(JSON.stringify(err));
        }else{
            new User({
                username:req.body.username,
                password:req.body.password,
                name:req.body.name
        
            }).save().then((newuser=>{
                var sucess={
                    statuscode:200,
                    message:"user Added",
                    id:newuser._id
        
        
                };
                new UserData({Name:req.body.name,userid:newuser._id}).save().then((userdata)=>{

                    res.end(JSON.stringify(sucess));
            
                });
               
        
            }));

        }

    });

  

});







module.exports=router;