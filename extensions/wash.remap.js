/**
 * This object makes it possible to rewrite one shell command to another. This
 * can be used not only for simple "macro" capability, but also to implement a
 * thin compatibility layer between the web shell and the Unix system, where
 * necessary.
 */
wash.remap = {};

// turn off highlighting in `cal` - it will display weirdly in the wash output
wash.remap['cal'] = {
    command: 'cal -h',
    callback: function(){
        shell.status.set('`cal` re-mapped to `' + this.command + '`.');
    },
}

// la -> ls -a
wash.remap['la'] = {
    command: 'ls -a',
    callback: function(){
        shell.status.set('`la` re-mapped to `' + this.command + '`.');
    },
}

// ll -> ls -l
wash.remap['ll'] = {
    command: 'ls -l',
    callback: function(){
        shell.status.set('`ll` re-mapped to `' + this.command + '`.');
    },
}

// run top in batch mode with a single iteration
wash.remap['top'] = {
    command: 'top -n1 -b',
    callback: function(){
        shell.status.set('`top` re-mapped to `' + this.command + '`.');    
    },
}

// run top in batch mode with a single iteration
wash.remap['feh'] = {
    command: false,
    callback: function(command){
        // spice the filename out of the command
        var parts    = command.split(' ');
        var filename = parts[1];
        // macro the image viewer
        wash.image.view({file: filename});
        shell.status.set('`feh` re-mapped to `wash.image.view()`.');    
    },
}

