/**
 * Initialize the application when the document has finished loading
 */
$(document).ready(function() {
    // -------------------- initialize ---------------------------------------
    // initialize the permanent storage
    wash.permastore.init();

    // initialize the shell members
    shell.init();

    // configure debugging
    shell.debug.enabled = false;
    
    // draw the shell
    shell.draw(); 

    // initialize the editor
    shell.editor.initialize();

    // prompt the user to choose a saved connection, if saved connections exist
    var num_saved_connections = wash.permastore.storage.connections.length;
    if(num_saved_connections > 1){
        shell.prompt.context.set('To begin, specify connection parameters above or choose a saved connection: ');
        wash.connection.choose();
        shell.draw(); 
    } else if(num_saved_connections === 1){
        shell.prompt.context.set('Your saved connection has been loaded. Issue a command to begin: ');
        wash.connection.load({connection: 0});
        shell.draw(); 
    } else {
        shell.prompt.context.set('To begin, specify connection parameters above: ');
        shell.draw(); 
    }

    // -------------------- bind events --------------------------------------
    // re-draw the shell when the window is resized
    $(window).resize(function(){shell.draw()});

    // bind to the main form
    shell.elements.terminal.bind('submit', function(){
        shell.prompt.enter();
        return false;
    });

    // inspect the prompt in real-time
    $(shell.elements.prompt)
        .keydown(function(e){ shell.key_monitor.key_down(e); })
        .keyup(function(e){ shell.key_monitor.key_up(e); });

    // send focus to the prompt when the terminal is clicked on 
    $(shell.elements.terminal).click(function(){ shell.prompt.focus() });

    // automatically update the connection parameters when they are changed
    $('#connection input, #connection select').change(function(obj){
        wash.connection.set(this.id, this.value);
    });

    // configure AJAX errors
    $(shell.elements.prompt).ajaxError(function(){
        shell.status.set('Connection failed.');
        shell.output.write('Failed to communicate with trojan. Please check connection parameters.', 'output wash_error');
        shell.elements.prompt.show();
        shell.elements.prompt_context.show();
        shell.elements.prompt.focus();
    });

    // -------------------- complete -----------------------------------------
    // initialize the status bar
    shell.status.set('Initialized wash version ' + wash.version + '.');
});
