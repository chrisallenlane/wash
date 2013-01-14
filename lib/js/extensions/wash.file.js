// Here we pop open the wash object once again to patch in some tailored
// functionality.
wash.file = {

    /*
    // @note: I've remapped these to more natural commands, so I'm
    // commenting out this help documentation for now.
    help: function(args){
        // push the help objects onto the array
        var help_objects = [];
        help_objects.push({
            command : "wash.file.help()",
            text    : "Displays the help commands for the wash.file object.",
        })
        help_objects.push({
            command : "wash.file.download({file: 'file.txt'})",
            text    : "Downloads the specified file.",
        })
        help_objects.push({
            command : "wash.file.up()",
            text    : "Prompts the user to upload a file.",
        })

        // output or return the help objects appropriately
        if(args != null && args.return === true){ return help_objects; }
        else { wash.help_display(help_objects); }
    },
    */

    // downloads a file
    down: function(args){
        // alert the user if we're switching to GET from another request type
        if(wash.connection.request_type != 'get'){
            var msg = "In order to download a file, a GET request must necessarily " +
                      "be made against the target server. Continue?";
            
            // cancel if the user is unwilling to change request types
            if(!confirm(msg)){ return false; }
        }

        // assemble the URL for the file download
        var url = wash.connection.protocol + '://';
        url += wash.connection.domain + ':';
        url += wash.connection.port;
        url += wash.connection.path + '?';
        url += 'args[file]=' + args.file + '&';
        url += 'args[password]=' + wash.connection.password + '&';
        url += 'action=payload_file_down';

        // download the file
        window.location.href = url;
    },

    // helper function that retrieves a file extensions
    get_extension: function(filename){
        return filename.substr((filename.lastIndexOf('.')) + 1);
    },

    // uploads files to the target server
    up: function(){
        // alert the user if we're switching to POST from another request type
        if(wash.connection.request_type != 'post'){
            var msg = "In order to download a file, a POST request must necessarily " +
                      "be made to the target server. Continue?";
            
            // cancel if the user is unwilling to change request types
            if(!confirm(msg)){ return false; }
        }

        // piece together the submission URL
        var post_to = wash.connection.protocol + '://' +
            wash.connection.domain + ':' + 
            wash.connection.port +
            wash.connection.path;

        // aggregate the HTML
        var html = "<h2>Upload Files</h2>" + 
        "<p>Select files to upload:</p>" +
        "<form id='wash_file_up' enctype='multipart/form-data' method='POST' action='" + post_to + "'>" + 
            "<input type='file'   name='files_up[]' multiple>" + 
            "<input type='hidden' name='action' value='payload_file_up'>" + 
            "<input type='hidden' name='args[password]' value='" + wash.connection.password + "'>" + 
            "<br><input type='submit' value='Upload'>" + 
        "</form>";

        // reveal the sidebar
        shell.sidebar.show();
        shell.elements.sidebar.html(html);
    },

    // no user should ever invoke this. It's sort of a "private" method
    upload: function(){
        shell.sidebar.hide();
    },
};
