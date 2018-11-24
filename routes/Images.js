var router=require("express").Router();
var fs=require("fs");
var mongoose =require("mongoose");
var UserData=require("../model/userdata");  // This model is use for handling details of user like dob,hobbies and etc...


/*

    Full path:- /image/list/52842zgg226222/1

    This router method take data from url as userid and image number 
    then query db and find image Name from image field at given index
    and then create path to perticular image and return image



*/


router.get("/list/:userid/:imagenumber",(req,res)=>{

    res.writeHead(200, {'Content-type':'image/jpeg'});

    UserData.findOne({userid:req.params.userid}).then((user)=>{
        try{
            var data=fs.readFileSync('./images/'+req.params.userid+"/compress/"+user.imageName[req.params.imagenumber-1]);
            res.write(data);
        }catch(err){
          //  var data=fs.readFileSync('./images/'+req.params.userid+"/"+user.imageName[req.params.imagenumber-1]);
          var data={
            statuscode:404,
            message:"Image not Found on given index"

          };
            res.write(data);
        }finally{
            res.end();
        }

       


    });

    

});



/*

    Full Path:- /image/changeprofilepic

    This router method userid and (imageNumber or imageid) as post request and 
    set requested image as profile pic and send JSON response.


*/


router.post("/changeprofilepic",(req,res)=>{

    
    if(!req.body.imageNumber){
        UserData.findOneAndUpdate({userid:req.body.userid},{profilepic:req.body.imageid},(err,data)=>{

            if(err){
                res.write(JSON.stringify({statuscode:403,message:"Problem while changing Profile pic"}));
            }else{
                res.write(JSON.stringify({statuscode:200,message:"Profilepic Changed successfully",userid:data.userid}));
            }
    
            res.end();
    
        });
    
    }else{

        UserData.findOneAndUpdate({userid:req.body.userid}).then((userdata)=>{

            var images=userdata.imageName;
            var Image=images[req.body.imageNumber-1];
            UserData.findOneAndUpdate({userid:req.body.userid},{profilepic:Image},(err,data)=>{

                if(err){
                    res.write(JSON.stringify({statuscode:403,message:"Problem while changing Profile pic"}));
                }else{
                    res.write(JSON.stringify({statuscode:200,message:"Profilepic Changed successfully",userid:data.userid}));
                }
        
                res.end();
        
            });

        });
    }

   
});


/*

    Full path :- image/profile/851fafa54222/

    This router method take userid from url and 
    display profile pic as response.



*/


router.get("/profile/:userid",(req,res)=>{

UserData.findOne({userid:req.params.userid}).then((user)=>{

    res.writeHead(200, {'Content-type':'image/jpeg'});

  
        try{
            var data=fs.readFileSync('./images/'+req.params.userid+"/compress/"+user.profilepic);
            res.write(data);
        }catch(err){
            var data={
                statuscode:404,
                message:"Image not found or Problem While loading image"
            };
            res.write(JSON.stringify(data));
        }finally{
            res.end();
        }

       


    


});


});

/*

        Full path:- /image/remove/5811aga47225/2

        This router method take userid and image number from url
        and delete imageName from DB and decrease image Counter by 1 and 
        remove Image file from file System then send JSON Response.


*/



router.get("/remove/:userid/:imagenumber",(req,res)=>{

    UserData.findOne({userid:req.params.userid}).then((user)=>{
    
        var Images=user.imageName;
        var image=Images[req.params.imagenumber-1];
        if(image){
            UserData.findOneAndUpdate({userid:user.userid},{$inc:{images:-1},$pullAll:{imageName:[image]}}).then((updatedUser)=>{
                var data={};
                    if(updatedUser){
                        try{
                            console.log(image);
                            fs.unlinkSync("./images/"+req.params.userid+"/compress/"+image);
                           data={
                                statuscode:200,
                                message:"Image Deleted successfully"
                    
                              };
    
                        }catch(e){
                            data={
                                statuscode:501,
                                message:"Problem while deleting Image"
                    
                              };
                              console.log(e);
    
                        }
                       
                       
    
                    }else{
                        data={
                            statuscode:501,
                            message:"Problem while deleting Image"
                
                          };
                    }
    
                    res.end(JSON.stringify(data));
    
            });
               


        }else{

            var data={
                statuscode:501,
                message:"Problem while deleting Image"
    
              };
              res.end(JSON.stringify(data));

        }

       
     
    
    
        
    
    
    });
    
    
    });
    






module.exports=router;