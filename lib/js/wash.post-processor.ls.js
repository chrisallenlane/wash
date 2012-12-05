wash.post_processor.ls = function(){
    // helper function that retrieves file extensions
    function get_extension(filename){
        extension = filename.substr((filename.lastIndexOf('.')) + 1);
    }

    // parse out the response into individual file names
    var files = wash.response.output.split("\n");

    // iterate over each file
    for(i = 0; i < files.length; i++){
        // a semantic convenience
        var filename = files[i];

        // ignore . and ..
        if(filename != '.' && filename != '..' ){
            get_extension(filename);
        }
    }
}


