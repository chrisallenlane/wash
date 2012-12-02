// encapsulates the status bar
shell.status = {
    // appends to the status bar
    append: function(data){
        shell.debug.log('shell.status.append');
        shell.elements.status.append(data);
    },

    // clears the status bar
    clear: function(){
        shell.debug.log('shell.status.clear');
        shell.elements.status.text('');
    },

    // sets the status bar message
    set: function(data){
        shell.debug.log('shell.status.set');
        shell.elements.status.text(data).text();
    },
}

