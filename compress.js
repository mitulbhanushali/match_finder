
var fs=require('fs');
var compress_images = require('compress-images'), INPUT_path_to_your_images, OUTPUT_path;

  function compressImage(directoryPath,filename,filetype){

    
 
   // INPUT_path_to_your_images = './images/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}';
//INPUT_path_to_your_images = './images/5b3f2f8fbc97c62e94c5e3e4/omFzQq2KmkH61c2Mjc9q5Ayw5t3DEFO8.jpeg';
INPUT_path_to_your_images=directoryPath+filename+"."+filetype;
console.log(INPUT_path_to_your_images);
    
    OUTPUT_path = directoryPath+'compress/';

    if(filetype=="jpg" || filetype=="jpeg"){
       compress_images(INPUT_path_to_your_images, OUTPUT_path, {compress_force: false, statistic: true, autoupdate: true}, false,
            {jpg: {engine: 'mozjpeg', command: ['-quality', '35']}},
            {png: {engine: false, command: ['--quality=20-50']}},
            {svg: {engine: false, command: '--multipass'}},
            {gif: {engine: false, command: ['--colors', '64', '--use-col=web']}}, function(){
});

    }else if(filetype=="png"){

        compress_images(INPUT_path_to_your_images, OUTPUT_path, {compress_force: false, statistic: true, autoupdate: true}, false,
            {jpg: {engine: false, command: ['-quality', '25']}},
            {png: {engine: 'pngquant', command: ['--quality=30-40']}},
            {svg: {engine: false, command: '--multipass'}},
            {gif: {engine: false, command: ['--colors', '64', '--use-col=web']}}, function(){
});


    }
    
   // 
    return;


}


module.exports.compressImage=compressImage;

