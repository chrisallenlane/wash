var shell = {

    // specify the window padding
    padding: 10,

    // draw the shell
    draw: function(){
        shell.debug.log('shell.command.draw');
        var window_height = $(window).innerHeight();
        var window_width  = $(window).innerWidth();
        var shell_width   = window_width  - (this.padding * 4);
        var shell_height  = window_height - (this.padding * 4);
        $('#shell').css('margin'  , this.padding + 'px 0 0 ' + this.padding + 'px');
        $('#shell').css('height'  , shell_height + 'px');
        $('#shell').css('width'   , shell_width + 'px');
        $('#shell').css('padding' , this.padding + 'px');
        $('#prompt').css('width'  , (shell_width - 2) + 'px');
    },

    // encapsulates command processing
    command: {

        // clears the command prompt
        clear: function(){
            shell.debug.log('shell.command.clear');
            $('#prompt').val('');
        },

        // enters a command
        enter: function(){
            shell.debug.log('shell.command.enter');
            var command = shell.command.get_prompt();
            shell.output.write(command);
            shell.command.history.add(command);
            shell.command.clear();
        },

        // gets the command prompt value
        get_prompt: function(){
            return $('#prompt').val();
        },

        // sets the command prompt value
        set_prompt: function(data){
            $('#prompt').val(data);
        },

        // tracks command history
        history: {
            
            // an array of historic commands
            commands: [],

            // current position in commands
            position: 0,

            // number of commands to track
            size: 1000,

            // adds a command to the history
            add: function(command){
                shell.debug.log('shell.command.history.add');
                shell.command.history.commands.push(command); 
                shell.command.history.position++;
                console.log(shell.command.history.commands);
            }, 

            // moves backward (older) in history
            backward: function(){
                shell.debug.log('shell.command.history.backward');
                if(shell.command.history.position >= 1){
                    shell.command.history.position--;
                    shell.command.set_prompt(shell.command.history.commands[shell.command.history.position]);
                }
            },
            
            // moves forward (more recent) in history
            forward: function(){
                shell.debug.log('shell.command.history.forward');
                if(shell.command.history.position <= (shell.command.history.commands.length - 1)){
                    shell.command.history.position++;
                    shell.command.set_prompt(shell.command.history.commands[shell.command.history.position]);
                }
            },

        },

    },


    // encapsulates output processing
    output: {

        // clears the shell output
        clear: function(){
            shell.debug.log('shell.output.clear');
            // @todo: don't actually clear: just scroll
            $('#output').html('');
        },

        // writes to the shell output
        write: function(data){
            shell.debug.log('shell.output.write');
            $('#output').append('<div class="command">' + data + '</div>');
        },

    },

    // encapsulates some simple debugging functionality
    debug: {

        // switch debugging on or off
        enabled: true,

        // logs output if debugging is enabled
        log: function(data){
            if(shell.debug.enabled){ console.log(data); }
        }

    },
}
