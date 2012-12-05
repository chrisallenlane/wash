var shell = {

    // specify the window padding
    padding: 10,

    // the percentage of the terminal space which should be taken
    // by the sidebar when displayed
    sidebar_percentage : .20,

    // take these measurements after the UI has been drawn initially
    terminal_height    : 0,
    terminal_width     : 0,

    // initialize the shell members after the document has loaded
    init: function(){
        // buffer the jQuery elements both to speed up the JavaScript a bit and
        // to facilitate loose coupling between the layout and logic
        shell.elements = {
            connection     : $('#connection'),
            editor_outer   : $('#editor_outer'),
            editor         : $('#editor'),
            inner_shell    : $('#inner_shell'),
            output         : $('#output'),
            password       : $('#password'),
            port           : $('#port'),
            prompt         : $('#prompt'),
            prompt_context : $('#prompt_context'),
            protocol       : $('#protocol'),
            request_type   : $('#request_type'),
            shell          : $('#shell'),
            sidebar        : $('#sidebar'),
            ssl            : $('#ssl'),
            status         : $('#status span'),
            terminal       : $('#terminal'),
            url            : $('#url'),
        };
    },

    // draw the shell
    draw: function(){
        shell.debug.log('shell.draw');

        // calculate the appropriate terminal height
        var window_height     = $(window).innerHeight();
        var connection_height = (this.elements.connection.is(':visible')) ? this.elements.connection.height() + (this.padding / 2) : 0 ;
        var status_height     = this.elements.status.height();
        var terminal_height   = window_height - connection_height - status_height - (this.padding * 5.5);

        // size the editor
        this.editor.draw();

        // size the terminal
        this.elements.terminal
            .css('height'     , terminal_height)
            .css('max-height' , terminal_height);

        // size the sidebar
        this.elements.sidebar
            .css('height'     , terminal_height)
            .css('max-height' , terminal_height);

        // draw (size) the command prompt
        this.prompt.draw();

        // record some measurements we'll need to make some dynamic UIs
        this.terminal_height = this.elements.terminal.height();
        this.terminal_width  = this.elements.terminal.width();
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
