$(document).ready(function() {
    // configure debugging
    shell.debug.enabled = config.debug;
    
    // draw the shell
    shell.draw(); 

    // re-draw the shell when the window is resized
    $(window).resize(function(){shell.draw()});

    // bind to the main form
    $(shell.elements.terminal).bind('submit', function(){
        shell.prompt.enter();
        return false;
    });

    // inspect the prompt in real-time
    $('#prompt')
        .keydown(function(e){ key_monitor.key_down(e); })
        .keyup(function(e){ key_monitor.key_up(e); });

    // send focus to the prompt when the terminal is clicked on 
    $('#terminal').click(function(){ shell.prompt.focus() });

    // automatically update the target parameters when they are changed
    $('#target input, #target select').change(function(obj){
        wash.target.update(this.id, this.value);
    });

    /*
    // @note
    $.post("http://test5.lab", { name: "John", time: "2pm" }, function(data) {
        alert("Data Loaded: " + data);
    });
    */
    
    shell.status.set('Initialized wash version ' + wash.version + '.');
});
