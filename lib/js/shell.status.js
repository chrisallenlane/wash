// encapsulates the status bar
shell.status = {
    // clears the status bar
    clear: function(){
        shell.debug.log('shell.status.clear');
        shell.elements.status.text('');
    },

    // gets the status bar message
    get: function(){
        return shell.elements.status.text();
    },

    // sets the status bar message
    set: function(data){
        shell.debug.log('shell.status.set');

        // only redraw the status bar if the new status is actually different
        // from what is already being displayed
        if(data != this.get()){
            shell.elements.status.fadeOut('slow', function(){
                shell.elements.status.text(data).text();
                shell.elements.status.fadeIn('slow');
            });
        }
    },
}

