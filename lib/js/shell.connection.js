// encapsulates connectioning functionality
shell.connection = {
    // hides the connection bar
    hide: function(){
        shell.debug.log('shell.connection.hide');
        shell.elements.connection.fadeOut(function(){
            shell.status.set('Connection bar hidden. Press Ctrl+h to unhide.');
            shell.draw();
        });
    },

    // un-hides the connection bar
    show: function(){
        shell.debug.log('shell.connection.show');
        shell.elements.connection.fadeIn(function(){
            shell.status.set('Connection bar revealed. Press Ctrl+h to hide.');
        });
    },

    // toggles connection bar visibility
    toggle: function(){
        shell.debug.log('shell.connection.toggle');
        if(shell.elements.connection.is(':visible')){
            shell.connection.hide();
            shell.draw();
        } else {
            shell.connection.show();
            shell.draw();
        }
    }
}
