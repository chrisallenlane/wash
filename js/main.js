$(document).ready(function() {
    // configure debugging
    shell.debug.enabled = config.debug;
    
    // draw the shell
    shell.draw(); 

    // re-draw the shell when the window is resized
    $(window).resize(function(){shell.draw()});


    /*
    // @note
    $.post("http://test5.lab", { name: "John", time: "2pm" }, function(data) {
        alert("Data Loaded: " + data);
    });
    */
    
    shell.status.set('Initializing wash version ' + wash.version);
});
