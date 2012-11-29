wash.command = {
    
    // buffer the object that will be encrypted and sent to the trojan
    obj: new Command(),

    // encrypts a command before sending to the trojan
    encrypt: function(){
        return true;
    },

    // decrypts a command before sending to the trojan
    decrypt: function(){
        return true;
    },

    // processes commands on the wash prompt
    process: function(command){
        // parse out the wash action
        if(shell.prompt.mode.get() == 'wash'){
            // process wash commands as pure JavaScript. This allows for
            // some tremendous extensibility
            try{
                eval(command);
            }catch(e){
                wash.response.obj.prompt_context = shell.prompt.context.get();
                wash.response.obj.output         = 'wash error: Invalid command.'
                shell.output.write(wash.response.obj.output , 'wash_error');
            }
        }
        
        // if the prompt is not in wash mode, default to shell action
        else {
            wash.command.obj.action = 'shell';
            wash.command.obj.cmd    = command;
            wash.command.encrypt();
            wash.command.send();
        }
    },

    // sends a command to the trojan
    send: function(){
        // make the AJAX request to the trojan
        $.ajax({
            type : wash.connection.request_type,
            url  : wash.connection.protocol + '://' + wash.connection.url,
            data : wash.command.obj,
        }).done(function(response){
            var response_obj  = JSON.parse(response);
            // this has to go here rather than in command.process because
            // it is a callback that will be processed asynchronously
            // @kludge
            var output_class = 'blah';
            // if a error was returned, output it to the console
            shell.prompt.context.set(response_obj.prompt_context);
            shell.output.write(response_obj.output , 'output ' + output_class);
        });
    }
}
