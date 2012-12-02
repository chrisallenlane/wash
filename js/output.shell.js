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

        // sanitize the output data
        var out       = $('<div/>').text(data).html();
        var out_class = (out_class == null) ? '' : out_class ;

        // append to the appropriate div
        shell.elements.output.append('<div class="' + out_class + '">' + out + '</div>');
        // autoscroll to the bottom of the output div
        shell.elements.terminal.scrollTop(shell.elements.terminal.prop('scrollHeight'));
    },
}
