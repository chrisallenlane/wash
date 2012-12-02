// encapsulates output processing
shell.output = {
    // clears the shell output
    clear: function(){
        shell.debug.log('shell.output.clear');
        shell.elements.output.text('');
    },

    // writes to the shell output
    write: function(data, out_class){
        shell.debug.log('shell.output.write');
        var out_class = (out_class == null) ? '' : out_class ;
        shell.elements.output.append('<div class="' + out_class + '">' + data + '</div>');
        // autoscroll to the bottom of the div when overflowing (to more faithfully
        // emulate a terminal's behavior)
        shell.elements.terminal.scrollTop(shell.elements.terminal.scrollHeight);
    },
}
