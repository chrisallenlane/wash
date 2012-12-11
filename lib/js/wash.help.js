wash.help = function(){
    // buffer the help objects
    var help_objects = [];
    
    // iterate over the wash object looking for help methods
    $.each(wash, function(key, val){
        if(wash[key].help != null){
            help_objects = help_objects.concat(wash[key].help({return: true}));
        }
    });

    // display the help text
    this.help_display(help_objects);
};

// formats and displays the help text
wash.help_display = function(help_array){
    // buffer the length of the longest command
    var longest_command_length = 0;

    // iterate over the commands to display in order to determine which
    // has the longest length
    $.each(help_array, function(index, value){
        if(value.command.length > longest_command_length){
            longest_command_length = value.command.length;
        }
    });

    // Iterate over the commands again, this time padding each to the length
    // of the longest. This creates a table-like alignment in the output.
    $.each(help_array, function(index, value){
        var num_pad_chars = (longest_command_length - value.command.length);
        value.command += new Array(num_pad_chars + 1).join(' ');
        shell.output.write(value.command + ' : ' + value.text, 'output wash');
    });
}
