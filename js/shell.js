var shell = {

    // specify the window padding
    padding: 10,

    // initialize the shell members after the document has loaded
    init: function(){
        // buffer the jQuery elements both to speed up the JavaScript a bit and
        // to facilitate loose coupling between the layout and logic
        shell.elements = {
            connection     : $('#connection'),
            inner_shell    : $('#inner_shell'),
            output         : $('#output'),
            password       : $('#password'),
            port           : $('#port'),
            prompt         : $('#prompt'),
            prompt_context : $('#prompt_context'),
            protocol       : $('#protocol'),
            shell          : $('#shell'),
            ssl            : $('#ssl'),
            status         : $('#status'),
            terminal       : $('#terminal'),
            url            : $('#url'),
        };
    },

    // draw the shell
    draw: function(){
        shell.debug.log('shell.draw');

        // calculate the appropriate terminal height
        var window_height = $(window).innerHeight();
        var connection_height = (this.elements.connection.is(':visible')) ? this.elements.connection.height() + (this.padding / 2) : 0 ;
        var status_height = this.elements.status.height();
        var terminal_height = window_height - connection_height - status_height - (this.padding * 6);

        this.elements.terminal
            .css('height', terminal_height)
            .css('max-height', terminal_height);

        // draw (size) the command prompt
        this.prompt.draw();
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
