var shell = {

    // specify the window padding
    padding: 10,

    // draw the shell
    draw: function(){
        shell.debug.log('shell.command.draw');
        
        // capture window and outer shell dimensions
        var window_height = $(window).innerHeight();
        var window_width  = $(window).innerWidth();
        var shell_width   = window_width  - (this.padding * 2);
        var shell_height  = window_height - (this.padding * 2);

        // draw #shell
        $('#shell').css('background-color', config.color.background);
        $('#shell').css('color'  , config.color.foreground);
        $('#shell').css('height' , shell_height + 'px');
        $('#shell').css('margin' , this.padding + 'px 0 0 ' + this.padding + 'px');
        $('#shell').css('width'  , shell_width + 'px');

        // draw #target
        $('#target').css('padding-bottom', (this.padding / 2) + 'px');
        $('#target input, #target select').css('background-color', config.color.background);
        $('#target input, #target select').css('color', config.color.foreground);
        $('#target input, #target select option').css('color', config.color.background);
        $('#target input, #target select').css('max-width', '400px');
        $('#target input, #target select').css('margin-right', (this.padding / 2) + 'px');
        $('#target input').css('width', (shell_width / 3) + 'px');
        $('#target #ssl').css('padding', '0 ' + this.padding + 'px');
        $('#target #ssl').css('background-color', config.color.background);

        // draw #prompt
        $('#prompt').css('background-color', config.color.background);
        $('#prompt').css('width'  , (shell_width - (2 * this.padding)) + 'px');

        // draw #status
        $('#status').css('width', shell_width + 'px'); 
        $('#status').css('top', (shell_height - (this.padding * 2)) + 'px'); 
        $('#status').css('border-top', (this.padding / 2) + 'px solid gray'); 
        $('#status').css('padding', (this.padding / 2) + 'px'); 
        
        // generic padding class
        $('.padded').css('padding' , this.padding + 'px');
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

    // encapsulates targeting functionality
    target: {

        // the path to the trojaned file
        url: 'http://example.com/path/to/trojan.php',

        // the password to unlock the trojan
        password: 'sex-secret-love-god',

        // clears the target
        clear: function(){
            shell.target.url      = '',
            shell.target.password = '',
            $('#url').val('');
            $('#password').val('');
        },

        // clears the target
        set: function(){
            shell.target.url      = $('#url').val('');
            shell.target.password = $('#password').val('');
        },

        // tests the connection to the target
        test: function(){
            //@TODO: implement this
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
