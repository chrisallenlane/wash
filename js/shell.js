var shell = {

    // specify the window padding
    padding: 10,

    // draw the shell
    draw: function(){
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
            console.log('shell.command.clear');
            $('#prompt').val('');
        },

        // enters a command
        enter: function(){
            console.log('shell.command.enter');
            shell.output.write($('#prompt').val());
            shell.command.clear();
        },
    },

    // encapsulates output processing
    output: {

        // clears the shell output
        clear: function(){
            console.log('shell.output.clear');
            // @todo: don't actually clear: just scroll
            $('#output').html('');
        },

        // writes to the shell output
        write: function(data){
            console.log('shell.output.write');
            $('#output').append('<div class="command">' + data + '</div>');
        },
    },
}
