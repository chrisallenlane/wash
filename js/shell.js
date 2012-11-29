var shell = {

    // specify the window padding
    padding: 10,

    // map elements to their jQuery selectors to facilitate loose-coupling
    // between the logic and layout
    elements: {
        inner_shell    : ('#inner_shell'),
        output         : ('#output'),
        password       : ('#password'),
        port           : ('#port'),
        prompt         : ('#prompt'),
        prompt_context : ('#prompt_context'),
        protocol       : ('#protocol'),
        shell          : ('#shell'),
        ssl            : ('#ssl'),
        status         : ('#status'),
        target         : ('#target'),
        terminal       : ('#terminal'),
        url            : ('#url'),
    },

    // draw the shell
    draw: function(){
        shell.debug.log('shell.draw');

        // calculate the appropriate terminal height
        var window_height = $(window).innerHeight();
        var target_height = ($(this.elements.target).is(':visible')) ? $(this.elements.target).height() + (this.padding / 2) : 0 ;
        var status_height = $(this.elements.status).height();
        var terminal_height = window_height - target_height - status_height - (this.padding * 6);

        $(this.elements.terminal)
            .css('height', terminal_height)
            .css('max-height', terminal_height);

        // draw (size) the command prompt
        this.prompt.draw();
    },

    // encapsulates the status bar
    status: {

        // appends to the status bar
        append: function(data){
            shell.debug.log('shell.status.append');
            $(shell.elements.status).append(data);
        },

        // clears the status bar
        clear: function(){
            shell.debug.log('shell.status.clear');
            $(shell.elements.status).text('');
        },

        // sets the status bar message
        set: function(data){
            shell.debug.log('shell.status.set');
            $(shell.elements.status).text(data).text();
        },

    },

    // encapsulates targeting functionality
    target: {

        // clears the target
        clear: function(){
            shell.debug.log('shell.target.clear');
            shell.target.url      = '',
            shell.target.password = '',
            $(shell.elements.url).val('');
            $(shell.elements.password).val('');
        },

        // hides the target bar
        hide: function(){
            shell.debug.log('shell.target.hide');
            $(shell.elements.target).fadeOut(function(){
                shell.status.set('Target bar hidden. Press Ctrl+h to unhide.');
                shell.draw();
            });
        },

        // clears the target
        set: function(){
            shell.debug.log('shell.target.set');
            shell.target.protocol = $(shell.elements.protocol).val();
            shell.target.url      = $(shell.elements.url).val();
            shell.target.port     = $(shell.elements.port).val();
            shell.target.password = $(shell.elements.password).val();
        },

        // un-hides the target bar
        show: function(){
            shell.debug.log('shell.target.show');
            $(shell.elements.target).fadeIn(function(){
                shell.status.set('Target bar revealed. Press Ctrl+h to hide.');
            });
        },

        // tests the connection to the target
        test: function(){
            shell.debug.log('shell.target.test');
            //@TODO: implement this
        },

        // toggles target bar visibility
        toggle: function(){
            shell.debug.log('shell.target.toggle');
            if($(shell.elements.target).is(':visible')){
                shell.target.hide();
                shell.draw();
            } else {
                shell.target.show();
                shell.draw();
            }
        }
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
