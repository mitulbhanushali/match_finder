var ignoreCase=require("ignore-case");


/* This method is core Method  of whole system 
    It takes reference as one User and then 
    compares with nearby users and after 
    some calculation it give score to 
    perticular pair and based on this 
    System will pair users.


*/

function findMatch(finder,listofuser){
var matching=[];


    for(var i=0;i<listofuser.length;i++){
        var hobbies=NumberOfHobbiesMatch(finder,listofuser[i]);
        var movie=NumberOfMovieMatch(finder,listofuser[i]);
        var music=NumberOfMusicMatch(finder,listofuser[i]);
        var travelling=NumberOfTravellingMatch(finder,listofuser[i]);
        var food=NumberOfFoodMatch(finder,listofuser[i]);
        var sport=NumberOfSportMatch(finder,listofuser[i]);
        var book=NumberOfBookMatch(finder,listofuser[i]);
        var dob=DobScore(finder,listofuser[i]);
        var total=hobbies+movie+music+travelling+food+sport+book+dob;   
        matching.push({userid:listofuser[i].userid,Name:listofuser[i].Name,Matching:total});
        
    }
    return matching;

}


function NumberOfHobbiesMatch(finder,matcher){
        var _noOfHobbiesMatch=0;

        for(var i=0;i<finder.hobbies.length;i++){

            for(var j=0;j<matcher.hobbies.length;j++){
                if(ignoreCase.equals(finder.hobbies[i],matcher.hobbies[j])){
                    _noOfHobbiesMatch++;
                }
            }
        }

        if(_noOfHobbiesMatch>=4){
            return 20;
        }else{
            return _noOfHobbiesMatch*5;
        }


}

function NumberOfMovieMatch(finder,matcher){

    var _noOfMovieMatch=0;

    for(var i=0;i<finder.movie.length;i++){

        for(var j=0;j<matcher.movie.length;j++){
            if(ignoreCase.equals(finder.movie[i],matcher.movie[j])){
                _noOfMovieMatch++;
            }
        }
    }

    if(_noOfMovieMatch>=4){
        return 20;
    }else{
        return _noOfMovieMatch*5;
    }


}



function NumberOfMusicMatch(finder,matcher){

    var _noOfMusicMatch=0;

    for(var i=0;i<finder.music.length;i++){

        for(var j=0;j<matcher.music.length;j++){
            if(ignoreCase.equals(finder.music[i],matcher.music[j])){
                _noOfMusicMatch++;
            }
        }
    }

    if(_noOfMusicMatch>=3){
        return 10;
    }else{
        return _noOfMusicMatch*3;
    }


}

function NumberOfTravellingMatch(finder,matcher){

    var _noOfTravellingMatch=0;

    for(var i=0;i<finder.travelling.length;i++){

        for(var j=0;j<matcher.travelling.length;j++){
            if(ignoreCase.equals(finder.travelling[i],matcher.travelling[j])){
                _noOfTravellingMatch++;
            }
        }
    }

    if(_noOfTravellingMatch>=3){
        return 15;
    }else{
        return _noOfTravellingMatch*5;
    }


}


function NumberOfFoodMatch(finder,matcher){

    var _noOfFoodMatch=0;

    for(var i=0;i<finder.food.length;i++){

        for(var j=0;j<matcher.food.length;j++){
            if(ignoreCase.equals(finder.food[i],matcher.food[j])){
                _noOfFoodMatch++;
            }
        }
    }

    if(_noOfFoodMatch>=3){
        return 15;
    }else{
        return _noOfFoodMatch*5;
    }


}


function NumberOfSportMatch(finder,matcher){

    var _noOfSportMatch=0;

    for(var i=0;i<finder.sport.length;i++){

        for(var j=0;j<matcher.sport.length;j++){
            if(ignoreCase.equals(finder.sport[i],matcher.sport[j])){
                _noOfSportMatch++;
            }
        }
    }

    if(_noOfSportMatch>=3){
        return 10;
    }else{
        return _noOfSportMatch*3;
    }


}

function NumberOfBookMatch(finder,matcher){

    var _noOfBookMatch=0;

    for(var i=0;i<finder.book.length;i++){

        for(var j=0;j<matcher.book.length;j++){
            if(ignoreCase.equals(finder.book[i],matcher.book[j])){
                _noOfBookMatch++;
            }
        }
    }

    if(_noOfBookMatch>=3){
        return 10;
    }else{
        return _noOfBookMatch*3;
    }


}

function DobScore(finder,matcher){

    if(Math.abs(finder.dob.yyyy-matcher.dob.yyyy)<=1){
        return 10;
    }else if(Math.abs(finder.dob.yyyy-matcher.dob.yyyy)<=2){
        return 7;
    }else if(Math.abs(finder.dob.yyyy-matcher.dob.yyyy)>=5){
        return -Math.abs(finder.dob.yyyy-matcher.dob.yyyy)*1.5 ;
    }else{
        return Math.abs(finder.dob.yyyy-matcher.dob.yyyy)*0.5;
    }
    
}





module.exports.findmatch=findMatch;