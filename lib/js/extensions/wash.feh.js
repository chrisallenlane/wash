wash.feh = {
    view: function(args){
        // alert the user if we're switching to GET from another request type
        if(wash.connection.request_type != 'get'){
            var msg = "In order to view an image, a GET request must necessarily " +
                      "be made against the target server. Continue?";
            
            // cancel if the user is unwilling to change request types
            if(!confirm(msg)){ return false; }
        }

        // assemble the URL for the file download
        var url = wash.connection.protocol + '://';
        url += wash.connection.domain + ':';
        url += wash.connection.port;
        url += wash.connection.path + '?';
        url += 'args[cwd]=' + wash.cwd + '&';
        url += 'args[file]=' + args.file + '&';
        url += 'args[password]=' + wash.connection.password + '&';
        url += 'action=payload_feh' + '&';

        // view the file
        window.open(url);
    }
};
