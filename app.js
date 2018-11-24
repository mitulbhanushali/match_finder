const app=require('express')();
const server=require("http").createServer(app);  // server handle request and response via app object
var  io=require("socket.io").listen(server);     
const bodyParser=require("body-parser");
const mongoose =require("mongoose");            // Mongoose is ORM which helps in DB oprations.
const fileupload=require("express-fileupload");
const  LiveUserslib=require("./chat/liveusers");         // This module is handles all the live users's info and operations with real time and return class

var LiveUsers=new LiveUserslib();  // LiveUserlib is class and LiveUsers is object 

var auth=require("./routes/auth");      // module is use for authentication purpose like login and signup
var userdata=require("./routes/userdata");  // this module handle data request from user like insert,update  profile data
var findmatch=require("./routes/match");    // this module handle request for user match purpose like sending,receiving & acceptin Match request
var ImageProcessing=require("./routes/Images"); //This module is use for image retrival stuff

var numofCpu=require("os").cpus().length;
var cluster=require("cluster");     // This library is use for running app on multiple cores

mongoose.connect('mongodb://localhost:27017/dating_app',()=>{
    console.log("mongo connect");
});

var Login=require("./model/login");

// This both middleware handles Post request data 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(fileupload()); // this middleware handle file uploading events


// Below all are Routes for different purpose
app.use("/auth",auth);
app.use("/userdata",userdata);
app.use("/match",findmatch); 
app.use("/image",ImageProcessing);   


// This route method is use for testing
// basicaly it respond with index.html file
// File upload and socket.io  are test using this file

app.get("/:userid",(req,res)=>{

    res.sendFile("index.html",{root:__dirname});
    
    console.log("Ip address"+req.connection.remoteAddress);
});



// Here if cluster is master then for loop iterate numofcpu times and 
// new child Process is created else  it is child process then 
// for each child process which is created by Master runs listen method 
// separatly and then all cores of processor is utilize

if(cluster.isMaster){

    console.log("Master is running on pid"+process.pid);
    for(var i=0;i<numofCpu;i++){
       cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
       // console.log(`worker ${worker.process.pid} died`);
      });
}else{
    
server.listen(9500,()=>{

    console.log("server is running on 9500 with "+numofCpu+" number of CPUS ");

});

console.log(`worker ${process.pid} started`);

}

//   Below code is for Socket and Real time data (chat)


io.sockets.on('connection',function(socket){

   
    // console.log("new uses is connected");

    socket.on("addUser",(data)=>{

        LiveUsers.addUser(data.userid,socket.id);       // This method takes userid from client and bind it with socketid then push them in users array
        LiveUsers.displayUsers();                       // This method display all live users on server console.
    });



    socket.on('disconnect',()=>{
        LiveUsers.removeUser(socket.id);                // When user leaves session this method remove user from live users array using socketid parameter
        console.log("user is disconnected");
        LiveUsers.displayUsers();
    });


    socket.on("liveUsers",(friendList)=>{               // This method takes list of friends ids and return friends id's and their online status

       LiveFriends=LiveUsers.checkLiveFriends(friendList);      // This method returns array of friend id and their status
        socket.emit("liveUserList",LiveFriends);

    });

 
});



