
// This class handles users for live session

class Users{

       
    // This constructor creates users array when class is intasiated from app.js

     constructor(){
        this.users=[];

     }


     // This method takes userid and check it is Live or not 

     checkUser(userid){

            for(let i=0;i<this.users.length;i++){
            
               if(this.users[i].userid==userid){
                        return true;
                }

            }
            return false;

     }

     // This method binds userid and socketid using users array 
     // it makes entry in users array as JSon object 

     addUser(userid,socketid){

        if(this.users.indexOf({userid:userid})>-1){
           
        }else{
            this.users.push({userid,socketid});
        }
       

     }


     // This method remove user from live users array using socketid

      removeUser(socketid){
 
        this.users.splice(this.users.indexOf({socketid:socketid}),1);
        
     }

     // This method only used for debugging and display whole user array

     displayUsers(){
         this.users.forEach(element => {
            
             console.log(element.userid+" "+element.socketid);
         });
     }


     // This method takes friends array and then check for each friend
     // and then bind isLive parameter with them and return new array

     checkLiveFriends(friendList){

       var liveFriends=[];
       this.displayUsers();


        friendList.forEach(friend=>{
            if(this.checkUser(friend)){
                liveFriends.push({userid:friend,isLive:true});
            }else{
                liveFriends.push({userid:friend,isLive:false});
            }
           
        });
        return liveFriends;


     }






}


module.exports=Users;