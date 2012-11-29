// encapsulates connectioning functionality
shell.connection = {
    // clears the connection
    clear: function(){
        shell.debug.log('shell.connection.clear');
        shell.connection.url      = '',
        shell.connection.password = '',
        $(shell.elements.url).val('');
        $(shell.elements.password).val('');
    },

    // hides the connection bar
    hide: function(){
        shell.debug.log('shell.connection.hide');
        $(shell.elements.connection).fadeOut(function(){
            shell.status.set('connection bar hidden. Press Ctrl+h to unhide.');
            shell.draw();
        });
    },

    // clears the connection
    set: function(){
        shell.debug.log('shell.connection.set');
        shell.connection.protocol = $(shell.elements.protocol).val();
        shell.connection.url      = $(shell.elements.url).val();
        shell.connection.port     = $(shell.elements.port).val();
        shell.connection.password = $(shell.elements.password).val();
    },

    // un-hides the connection bar
    show: function(){
        shell.debug.log('shell.connection.show');
        $(shell.elements.connection).fadeIn(function(){
            shell.status.set('connection bar revealed. Press Ctrl+h to hide.');
        });
    },

    // tests the connection to the connection
    test: function(){
        shell.debug.log('shell.connection.test');
        //@TODO: implement this
    },

    // toggles connection bar visibility
    toggle: function(){
        shell.debug.log('shell.connection.toggle');
        if($(shell.elements.connection).is(':visible')){
            shell.connection.hide();
            shell.draw();
        } else {
            shell.connection.show();
            shell.draw();
        }
    }
}
