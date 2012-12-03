/**
 * Initialize the application when the document has finished loading
 */
$(document).ready(function() {
    // initialize the permanent storage
    wash.permastore.init();

    // initialize the shell members
    shell.init();

    // configure debugging
    shell.debug.enabled = false;
    
    // draw the shell
    shell.draw(); 

    // re-draw the shell when the window is resized
    $(window).resize(function(){shell.draw()});

    // bind to the main form
    shell.elements.terminal.bind('submit', function(){
        shell.prompt.enter();
        return false;
    });

    // inspect the prompt in real-time
    $('#prompt')
        .keydown(function(e){ key_monitor.key_down(e); })
        .keyup(function(e){ key_monitor.key_up(e); });

    // send focus to the prompt when the terminal is clicked on 
    $('#terminal').click(function(){ shell.prompt.focus() });

    // automatically update the connection parameters when they are changed
    $('#connection input, #connection select').change(function(obj){
        wash.connection.set(this.id, this.value);
    });
    
    // initialize the status bar
    shell.status.set('Initialized wash version ' + wash.version + '.');
});