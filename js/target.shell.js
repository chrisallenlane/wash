// encapsulates targeting functionality
shell.target = {
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
}
