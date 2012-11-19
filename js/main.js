$(document).ready(function() {
    // re-draw the shell when the window is resized
    $(window).resize(function(){shell.draw()});

    // draw the shell
    shell.draw(); 
});
