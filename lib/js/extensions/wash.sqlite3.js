// Here we pop open the wash object once again to patch in some tailored
// functionality.
wash.sqlite3 = {

    // buffer the raw SQL command for later use
    cmd: '',
    prompt: 'sqlite>',

    // the help text
    help: function(args){
        // push the help objects onto the array
        var help_objects = [];
        help_objects.push({
            command : "wash.sqlite3.help()",
            text    : "Displays the help commands for the wash.sqlite3 object.",
        });
        help_objects.push({
            command : "wash.sqlite3.connect({file: 'file.db'})",
            text    : "Connects to the specified sqlite3 database.",
        });
        help_objects.push({
            command : "wash.sqlite3.disconnect()",
            text    : "Disconnects from the connected sqlite3 database.",
        });
        help_objects.push({
            command : "wash.sqlite3.dump({file: 'file.db', outfile: 'out.sql'})",
            text    : "Dumps the connected sqlite3 database to a specified outfile.",
        });

        // output or return the help objects appropriately
        if(args !== undefined && args.return === true){ return help_objects; }
        else { wash.help_display(help_objects); }
    },

    // buffer the sqlite3 database file
    connection: {
        file: '',
    },

    // buffer some objects when changing emulation modes
    old_objects: {
        history         : {},
        process_command : {},
        prompt          : '',
    },

    // this will begin an emulation of a sqlite3 terminal
    connect: function(connection_parameters){
        // set the connection parameters
        wash.sqlite3.connection.file = connection_parameters.file;

        // @todo: some kind of success-failure detection would be ideal

        // get the sqlite3 version information
        wash.sqlite3.get_version();

        // visually signify that we're entering an emulated session
        $('body').animate({ backgroundColor : '#0482CC' }, 500);

        // buffer the previous session's settings
        wash.sqlite3.old_objects.prompt = shell.prompt.context.get();
        shell.prompt.context.set(this.prompt);

        // buffer the previous process command - this is where the real "magic"
        // happens that makes this work
        wash.sqlite3.old_objects.process_command = wash.process; 

        // keep the sqlite3 command history separate from the main history
        // (I'm just buffering the whole damn thing here, methods and all)
        wash.sqlite3.old_objects.history = $.extend(true, {}, shell.history); // deep copy
        shell.history.reset();

        // now, write a new function to process commands
        wash.process = function(command){
            // buffer the raw SQL command
            wash.sqlite3.cmd = command;

            // parse out the wash action
            if(shell.prompt.mode.get() == 'wash'){
                try{
                    eval(command);
                }catch(e){
                    shell.output.write('wash error: Invalid command.', 'output wash_error');
                }
            }

            // support the exit/quit command
            else if(command == '.exit' || command == '.quit'){
                wash.sqlite3.disconnect();
            }
            
            // if the prompt is not in wash mode, default to sqlite3 action
            else {
                // escape quotations
                command = command.replace(/["]/g, '\\"');

                // emulate the console by running queries through the shell
                var cmd = 'sqlite3 -batch ';
                cmd += wash.sqlite3.connection.file;
                cmd += ' "' + command + '"'; 

                // communicate with the trojan
                wash.command.action        = 'shell';
                wash.command.args.cmd      = cmd;
                wash.command.args.password = wash.connection.password;

                wash.net.send(function(){  
                    // display the output
                    if(wash.response.error !== undefined && wash.response.error !== ''){
                        shell.output.write(wash.response.error, 'output wash_error');
                    }
                    else { shell.output.write(wash.response.output.stdout, 'output'); }
                });
            }
        };
    },

    // disconnects from the terminal emulation
    disconnect: function(){
        shell.status.set('sqlite3 emulation terminated.');

        // animate back to the default terminal colors
        $('body').animate({ backgroundColor : '#708090' }, 500);

        // restore the old history
        shell.history = wash.sqlite3.old_objects.history;

        // restore the old process function
        wash.process = wash.sqlite3.old_objects.process_command;

        // restore the old prompt
        shell.prompt.context.set(wash.sqlite3.old_objects.prompt);
        shell.prompt.draw();
    },

    // dumps a sqlite3 database
    dump: function(params){
        // could have done this inline below, but this makes the linter
        // stop complaining
        var database = '';
        var outfile  = '';

        // make it possible to dump a database without first connecting to it
        if(params.file !== undefined){ database = params.file; }
        else { database = wash.sqlite3.connection.file; }

        // use a default outfile if one is not specified
        if(params.outfile !== undefined){ outfile = params.outfile; }
        else { outfile = 'sqlite3-dump.sql'; }

        // assemble the dump command
        var cmd = 'sqlite3 -batch ';
        cmd += database;
        cmd += " .dump"; 
        cmd += " > " + outfile;

        // communicate with the trojan
        wash.command.action   = 'shell';
        wash.command.args.cmd = cmd;
        wash.net.send(function(){  
            // display output or error, depending on which was received
            if(wash.response.error !== undefined){ shell.output.write(wash.response.error, 'output wash_error'); }
            else { shell.output.write(wash.response.output.stdout, 'output'); }
        });
    },

    // returns sqlite3 client version information
    get_version: function(){
        // assemble the command to send to the trojan
        wash.command.action   = 'shell';
        wash.command.args.cmd = 'sqlite3 -version';
        wash.net.send(function(){  
            shell.status.set('Emulating sqlite3 client. (' + wash.response.output.stdout + ')');
        });
    },
};
