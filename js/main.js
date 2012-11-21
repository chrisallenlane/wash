$(document).ready(function() {
    // configure debugging
    shell.debug.enabled = config.debug;
    
    // draw the shell
    shell.draw(); 

    // re-draw the shell when the window is resized
    $(window).resize(function(){shell.draw()});

    // bind to the main form
    $(shell.elements.terminal).bind('submit', function(){
        shell.command.prompt.enter();
        return false;
    });

    // inspect the prompt in real-time
    $('#prompt')
        .keydown(function(e){ key_monitor.key_down(e); })
        .keyup(function(e){ key_monitor.key_up(e); });

    $('#terminal').click(function(){ shell.command.prompt.focus() });

    /*
    // @note
    $.post("http://test5.lab", { name: "John", time: "2pm" }, function(data) {
        alert("Data Loaded: " + data);
    });
    */
    
    shell.status.set('Initialized wash version ' + wash.version + '.');
});
