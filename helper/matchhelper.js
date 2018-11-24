var mongoose =require("mongoose");
var UserData=require("../model/userdata");
var matchpercent=require("../logic/matchpercent");
var User=require("../model/user");
var Match=require("../model/match");




/*

  It takes senderid and receiverid then it find users 
  in Match collection then update MatchReqSend for sender 
  and MatchreqRec for receiver by pushing respective userid.
  If user is not present in Match collection then first it
  creates user and then push data in field.



*/



function MatchRequest(req,res){


    // find sender and push receiverid in MatchreqSend field 

    Match.findOneAndUpdate({userid:req.body.senderid},{$push:{MatchreqSend:req.body.receiverid}}).then((user)=>{

        if(user){

            // If sender Found then find receiver and push senderid in MatchreqRec field.

          Match.findOneAndUpdate({userid:req.body.receiverid},{$push:{MatchreqRec:req.body.senderid}}).then((user)=>{
    
            if(user){ // if user not null then both user are present and data is pushed successfully.

              res.write(JSON.stringify({statuscode:200,message:"Request send successfully"}));
              res.end();
               
            }else{        // If Receiver not found then create Match field then push data.

              new Match({
                userid:req.body.receiverid,
                MatchreqRec:req.body.senderid
              }).save().then((match)=>{
                if(match){
                  res.write(JSON.stringify({statuscode:200,message:"Request send successfully"}));
                  res.end();
                }else{
                  res.write(JSON.stringify({statuscode:403,message:"Problem sending request "}));
                  res.end();
                }
        
              });
            }
           
    
        
          });
        }else{          // If Sender not found Then create Match field first and then push data
          new Match({
            userid:req.body.senderid,
            MatchreqSend:req.body.receiverid
          }).save((err)=>{
            console.log(err);
              if(!err){
                Match.findOneAndUpdate({userid:req.body.receiverid},{$push:{MatchreqRec:req.body.senderid}}).then((user)=>{
    
                  if(user){
                    res.write(JSON.stringify({statuscode:200,message:"Request send successfully"}));
                    res.end();
                  }else{
                    new Match({
                      userid:req.body.receiverid,
                      MatchreqRec:req.body.senderid
                    }).save().then((match)=>{
                      if(match){
                        res.write(JSON.stringify({statuscode:200,message:"Request send successfully"}));
                        res.end();
                      }else{ // problem in creating Match field for receiver...  
                        res.write(JSON.stringify({statuscode:403,message:"Problem sending request temp"}));
                        res.end();
                      }
              
                    });
                  }
                 
              
              
                });
              }else{  // problem in creating Match field for sender...  
                res.write(JSON.stringify({statuscode:403,message:"Problem sending request temp"})); 
                res.end();
              }
    
          });
            
        }
        
       
    
    
      });

}

/*

 This method accept match request for perticular user.

 here,
       senderid = user which is accepting request
       matcher = user who sends request
    
   find sender's collection and from that update 
   MatchreqRec field by removing matcher from list and
   add matcher to Matches Field

  

*/


function AcceptRequest(req,res){
    
Match.findOne({userid:req.body.senderid}).then((match)=>{

    if(match){
      var _newrecRequestSet={};
      var index=-1;
      for(var i=0;i<match.MatchreqRec.length;i++){
        if(req.body.matcher==match.MatchreqRec[i]){
          index=i;
          break;
        }
      }
      if(i>=0){
        _newrecRequestSet=match.MatchreqRec.splice(index,i);
        Match.findOneAndUpdate({userid:req.body.senderid},{$push:{Matches:req.body.matcher},MatchreqRec:_newrecRequestSet}).then((match)=>{
            if(match){
              Match.findOne({userid:matcher}).then((match)=>{  // fetching matcher data

                var _newrecRequestSet={};
                var index=-1;
                for(var i=0;i<match.MatchreqSend.length;i++){     // finding index of sender in MatchreqSend
                  if(req.body.senderid==match.MatchreqSend[i]){
                    index=i;
                    break;
                  }
                }
                  if(i>=0){
                    _newrecRequestSet=match.MatchreqSend.splice(index,i);
                    // In below step pushing senderid in Matches and remove from MatchreqSend 
                    Match.findOneAndUpdate({userid:req.body.matcher},{$push:{Matches:req.body.senderid},MatchreqSend:_newrecRequestSet}).then((match)=>{
                        if(match){
                          res.write(JSON.stringify({statuscode:200,message:"Request Accepted"}));
                          res.end();
                        }
                    });
                  }else{
                    res.write(JSON.stringify({statuscode:403,message:"Problem While Processing Your Request "}));
                    res.end();
                  }


              });
             
  
              
               
            }else{
              res.write(JSON.stringify({statuscode:403,message:"Problem While Processing Your Request "}));
              res.end();
            }
        });
      }else{
        res.write(JSON.stringify({statuscode:403,message:"Problem While Processing Your Request "}));
        res.end();
      }
    
  
    }else{
      res.write(JSON.stringify({statuscode:403,message:"Problem While Processing Your Request "}));
      res.end();
    }
  
  
  });
}


/*

  This method is same as AcceptRequest but
  minor change is that here we only remove
  userid from both list MatchreqRec & MatchreqSend
  Respectivly.

*/




function RejectRequest(req,res){
    
    Match.findOne({userid:req.body.senderid}).then((match)=>{
    
        if(match){
          var _newrecRequestSet={};
          var index=-1;
          for(var i=0;i<match.MatchreqRec.length;i++){
            if(req.body.matcher==match.MatchreqRec[i]){
              index=i;
              break;
            }
          }
          if(i>=0){
            _newrecRequestSet=match.MatchreqRec.splice(index,i);
            Match.findOneAndUpdate({userid:req.body.senderid},{MatchreqRec:_newrecRequestSet}).then((match)=>{
                if(match){
      
                  var _newrecRequestSet={};
                  var index=-1;
                  for(var i=0;i<match.MatchreqSend.length;i++){
                    if(req.body.senderid==match.MatchreqSend[i]){
                      index=i;
                      break;
                    }
                  }
                    if(i>=0){
                      _newrecRequestSet=match.MatchreqSend.splice(index,i);
                      Match.findOneAndUpdate({userid:req.body.matcher},{MatchreqSend:_newrecRequestSet}).then((match)=>{
                          if(match){
                            res.write(JSON.stringify({statuscode:200,message:"Request Process Successfully"}));
                            res.end();
                          }
                      });
                    }else{
                      res.write(JSON.stringify({statuscode:403,message:"Problem While Processing Your Request "}));
                      res.end();
                    }
      
                  
                   
                }else{
                  res.write(JSON.stringify({statuscode:403,message:"Problem While Processing Your Request "}));
                  res.end();
                }
            });
          }else{
            res.write(JSON.stringify({statuscode:403,message:"Problem While Processing Your Request "}));
            res.end();
          }
        
      
        }else{
          res.write(JSON.stringify({statuscode:403,message:"Problem While Processing Your Request "}));
          res.end();
        }
      
      
      });
    }


module.exports.MatchRequest=MatchRequest;
module.exports.AcceptRequest=AcceptRequest;
module.exports.RejectRequest=RejectRequest;