$(document).ready(function() {
    // draw the shell
    shell.draw(); 

    // re-draw the shell when the window is resized
    $(window).resize(function(){shell.draw()});

    // disable debugging
    shell.debug.enabled = false;
});
