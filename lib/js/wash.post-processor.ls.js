wash.post_processor.ls = function(){

    // parse out the response into individual file names
    var files = wash.response.output.split("\n");

    // iterate over each file
    for(i = 0; i < files.length; i++){
        // a semantic convenience
        var filename = files[i];

        // ignore . and ..
        if(filename != '.' && filename != '..' ){
            wash.file.get_extension(filename);
        }
    }
};
