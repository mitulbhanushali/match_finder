var router=require('express').Router();
var mongoose =require("mongoose");
var UserData=require("../model/userdata");   // This model is use for handling details of user like dob,hobbies and etc...
var fs=require('fs');
var randomstring=require("randomstring");
var compress=require('../compress');   // this module is use to compress image files 



/*

    This router method is use to create user entry in userdata
    collection but after changing signup code this method is 
    now useless...

*/


router.post("/insertdata",(req,res)=>{

    // for (var propName in req.body) {
    //     if (req.body.hasOwnProperty(propName)) {
    //         console.log(propName, req.body[propName]);
    //     }
    // }

    // console.log(req.body);

    UserData.findOne({userid:req.body.userid}).then((data)=>{

        if(!data){
            new UserData(req.body).save().then((userdata)=>{

                res.end(JSON.stringify(userdata));
        
            });
        
        }else{
            res.end(JSON.stringify({statuscode:503,message:"data of user already exsits"}));
        }


    });


    


});


/*

    Full path:- /userdata/updatedata

    This router method is use to update user details
    and it takes userid as post request parameter.


*/


router.post("/updatedata",(req,res)=>{

    console.log(req.body);
    UserData.findOneAndUpdate({userid:req.body.id},req.body,(err,raw)=>{

        if(err){
            res.end(JSON.stringify( err));
        }
        res.end(JSON.stringify(raw));

    });

});



/*

    full path:- /userdata/displaydata

    This router method is use to display all
    user data and it takes userid as post request 
    parameter and send JSON response as data.

*/

router.post("/displaydata",(req,res)=>{


    UserData.findOne({userid:req.body.userid}).then((userinfo)=>{

        res.end(JSON.stringify(userinfo));

    });

});


/* 

    full path:- /userdata/uploadImages

    This router method use to upload images,
    it take image and userid then after compressing 
    image it store in file system and make entry in 
    DB.


*/


router.post("/uploadImages", (req,res)=>{

    if(!fs.existsSync("./images/"+req.body.userid)){
        fs.mkdir("./images/"+req.body.userid);
        if(!fs.existsSync("./images/"+req.body.userid+"/compress/")){
            fs.mkdir("./images/"+req.body.userid+"/compress/");
        }
    }
    var Image=req.files.image;
    var filename=randomstring.generate();
    var type=Image.mimetype.split("/")[1];
    Image.mv("./images/"+req.body.userid+"/"+filename+"."+type);

    UserData.findOneAndUpdate({userid:req.body.userid},{$inc:{images:1},$push:{imageName:filename+"."+type}},(err,raw)=>{

        if(err){
            res.end(JSON.stringify( err));
        }

       var data= compress.compressImage("./images/"+req.body.userid+"/",filename,type);
       setTimeout(()=>{ fs.unlinkSync("./images/"+req.body.userid+"/"+filename+"."+type);} ,5000);
      
       // Below line check if given image is first image then it automatically set it to profile pic

        UserData.findOneAndUpdate({$and:[{userid:req.body.userid},{images:{$lte:1}}]},{profilepic:filename+"."+type}).then((data,raw)=>{
               
        });



        res.end(JSON.stringify({statuscode:200,message:"image uploaded successfully",id:raw._id}));

    });


});

module.exports=router;
