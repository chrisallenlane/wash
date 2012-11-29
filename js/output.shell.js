// encapsulates output processing
shell.output = {
    // clears the shell output
    clear: function(){
        shell.debug.log('shell.output.clear');
        $(shell.elements.output).text('');
    },

    // writes to the shell output
    write: function(data, out_class){
        var out_class = (out_class == null) ? '' : out_class ;
        shell.debug.log('shell.output.write');
        $(shell.elements.output).append('<div class="' + out_class + '">' + data + '</div>');
    },
}
