// encapsulates output processing
shell.output = {
    // clears the shell output
    clear: function(){
        shell.elements.output.text('');
    },

    // writes to the shell output
    write: function(data, out_class){
        // sanitize the output data
        var out   = $('<div/>').text(data).html();
        out_class = (out_class === null) ? '' : out_class ;

        // append to the appropriate div
        var buffer = '<div class="' + out_class + '">' + out + '</div>';
        shell.elements.output.append(buffer);

        // autoscroll to the bottom of the output div
        shell.elements.terminal.scrollTop(shell.elements.terminal.prop('scrollHeight'));
    },
};
