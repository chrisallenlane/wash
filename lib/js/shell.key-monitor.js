/* This object's chief purpose is to monitor the keyboard events on the 
 * #prompt element */

// @note @kludge: there's some redundancy between here and keybindings.js that I
// need to remove later. This is really inelegant currently. 
//
shell.key_monitor = {

    // map some key codes to semantic variable names
    keycodes: {
        arrow: {
            up      : 38,
            down    : 40,
            left    : 37,
            right   : 39,
        },
        char: {
            h       : 72,
            l       : 76,
            m       : 77,
            p       : 80,

        },
        meta: {
            shift   : 16,
            control : 17,
            alt     : 18,
        },
    },

    // I need to track these key states manually
    state: {
        shift   : false,
        control : false,
        alt     : false,
    },

    // listens to the $.keydown event
    key_down: function(e){
        shell.debug.log('key_monitor.key_down');
        this.monitor_meta_down(e);

        // bind up and down arrows to history commands
        if(e.keyCode == this.keycodes.arrow.up){ shell.history.backward(); }
        if(e.keyCode == this.keycodes.arrow.down){ shell.history.forward(); }

        // watch for ctrl+h
        if(this.state.control && e.keyCode == this.keycodes.char.h){
            shell.connection.toggle();
            event.preventDefault();
        }

        // watch for ctrl+l
        if(this.state.control && e.keyCode == this.keycodes.char.l){
            shell.output.clear();
            event.preventDefault();
        }

        // watch for ctrl+m
        if(this.state.control && e.keyCode == this.keycodes.char.m){
            shell.editor.mode();
            event.preventDefault();
        }

        // watch for ctrl+p
        if(this.state.control && e.keyCode == this.keycodes.char.p){
            shell.prompt.focus();
            event.preventDefault();
        }
        
        // capture the command as it is being typed
        var command = shell.prompt.get();

        // extract the "root" of the command to determine which mode to set
        var space_pos = command.indexOf(' ');
        if(space_pos === -1){ wash.command_root = command; }
        else { wash.command_root = command.substr(0, space_pos); }

        // switch modes accordingly
        if(command.substr(0, 4) === 'wash'){
            shell.prompt.mode.set('wash');
        } else if(wash.remap[wash.command_root] != null){
            shell.prompt.mode.set('remap');
        } else {
            shell.prompt.mode.set('shell');
        }
    }, 

    // listens to the $.keyup event
    key_up: function(e){
        shell.debug.log('key_monitor.key_up');
        this.monitor_meta_up(e);
    },

    // listens for meta keys to be pressed
    monitor_meta_down: function(e){
        shell.debug.log('key_monitor.monitor_meta_down');
        // flag the down state of meta keys
        if(e.keyCode == this.keycodes.meta.shift){ this.state.shift = true; }
        if(e.keyCode == this.keycodes.meta.control){ this.state.control = true; }
        if(e.keyCode == this.keycodes.meta.alt){ this.state.alt = true; }
    },

    // listens for meta keys to be released
    monitor_meta_up: function(e){
        shell.debug.log('key_monitor.monitor_meta_up');
        // flag the down state of meta keys
        if(e.keyCode == this.keycodes.meta.shift){ this.state.shift = false; }
        if(e.keyCode == this.keycodes.meta.control){ this.state.control = false; }
        if(e.keyCode == this.keycodes.meta.alt){ this.state.alt = false; }
    },

}
