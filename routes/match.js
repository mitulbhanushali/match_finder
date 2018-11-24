var router=require('express').Router();
var mongoose =require("mongoose");
var UserData=require("../model/userdata");

var matchpercent=require("../logic/matchpercent");  // THis module helps in finding Match percentage Finder.

var User=require("../model/user");

var Match=require("../model/match");  // This model handle Match data for DB.

var MatchHelper=require("../helper/matchhelper");  // This module contains methods for handling Match Request


/*

  Full path:- /match/findmatch

  This Router method takes userid as post request 
  and find Match Percentage with other opposite 
  gender user and send Json response.


*/





router.post("/findmatch",(req,res)=>{

    UserData.findOne({userid:req.body.userid}).then((finder)=>{

        UserData.find({$and:[{city:req.body.city},{gender:req.body.gender}]}).then((users)=>{

            var data=matchpercent.findmatch(finder,users);
           res.end(JSON.stringify(data));


    });


    });

    

});



/*

  Full Path:- /match/findcustommatch

  THis router method handle custom data for 
  match request which user enters for every 
  request.

  Request data:=

      body={
        userid:"contains userid ",
        data:{
          city:"",
          dob:"",
          hobbies:[],
          movies:[]
        }

      }


*/


router.post("/findcustommatch",(req,res)=>{

  UserData.findOne({userid:req.body.userid}).then((finder)=>{

    if(!finder){
       // No user found
        var data={
          statuscode:404,
          message:"userid is not Proper "
        };
        res.end(JSON.stringify(data));

     
    }else{
      UserData.find({$and:[{city:req.body.data.city},{gender:req.body.data.gender}]}).then((users)=>{

      var data=matchpercent.findmatch(req.body.data,users);
      res.end(JSON.stringify(data));
        

      });
    }

      


  });

  

});


/*

    full path:- /match/matchrequest

    This router method send request for match 
    to other user and it takes senderid & receiverid 
    as request and send Json Response .

*/




router.post("/matchrequest",(req,res)=>{


 
MatchHelper.MatchRequest(req,res);   // This is a handler method which handles all the DB operations and send response to user.


});


/*

  Full path:-/match/showrequest/54afba875123/

  This router method takes userid from url and
  Display all requests which user gets as JSON
  Response.


*/



router.get("/showrequest/:userid",(req,res)=>{

  Match.findOne({userid:req.params.userid}).then((match)=>{

      if(match){
        res.write(JSON.stringify({statuscode:200,user:match.userid,request:match.MatchreqRec }));
      }else{
        res.write(JSON.stringify({statuscode:403,message:"problem while processing your request"}));
      }
      res.end();
  
  });


});


/*
    Full Path:- /match/acceptrequest/

    This Router method use to accept given 
    request

*/



router.post("/acceptrequest/",(req,res)=>{

MatchHelper.AcceptRequest(req,res);



});


/*
    Full Path:- /match/rejectrequest/

    This Router method use to reqject given 
    request

*/

router.post("/rejectrequest/",(req,res)=>{

  MatchHelper.RejectRequest(req,res);
  
  
  
  });


  /*

  Full path:-/match/showmatches/54afba875123/

  This router method takes userid from url and
  Display all Accepted Matches which user gets as JSON
  Response.


*/




router.get("/showmatches/:userid",(req,res)=>{

  Match.findOne({userid:req.params.userid}).then((match)=>{

      if(match){
        res.write(JSON.stringify({statuscode:200,user:match.userid,Matches:match.Matches }));
      }else{
        res.write(JSON.stringify({statuscode:403,message:"problem while processing your request"}));
      }
      res.end();
  
  });


});





module.exports=router;