/* This object's chief purpose is to monitor the keyboard events on the 
 * #prompt element */
var key_monitor = {

    // map some key codes to semantic variable names
    keycodes: {
        arrow: {
            up      : 38,
            down    : 40,
            left    : 37,
            right   : 39,
        },
        meta: {
            shift   : 16,
            control : 17,
            alt     : 18,
        },
        // I need to track these key states manually
        state: {
            shift   : false,
            control : false,
            alt     : false,
        },
    },

    // 
    key_down: function(e){
        console.log('KM key down.');
        this.monitor_meta_down(e);

        // bind up and down arrows to history commands
        if(e.keyCode == this.keycodes.arrow.up){ shell.command.history.backward(); }
        if(e.keyCode == this.keycodes.arrow.down){ shell.command.history.forward(); }
    }, 

    // 
    key_up: function(e){
        console.log('KM key up.');
        this.monitor_meta_up(e);
    },

    // monitors for meta keys to be pressed
    monitor_meta_down: function(e){
        // flag the down state of meta keys
        if(e.keyCode == this.keycodes.meta.shift){ this.keycodes.state.shift = true; }
        if(e.keyCode == this.keycodes.meta.control){ this.keycodes.state.control = true; }
        if(e.keyCode == this.keycodes.meta.alt){ this.keycodes.state.alt = true; }
    },

    // monitors for meta keys to be released
    monitor_meta_up: function(e){
        if(e.keyCode == this.keycodes.meta.shift){ this.keycodes.state.shift = false; }
        if(e.keyCode == this.keycodes.meta.control){ this.keycodes.state.control = false; }
        if(e.keyCode == this.keycodes.meta.alt){ this.keycodes.state.alt = false; }
    },

}
