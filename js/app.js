var shell = {

    // draw the shell
    draw: function(){
        var window_height = $(window).innerHeight();
        var window_width  = $(window).innerWidth();
        var shell_width   = window_width - 40;
        var shell_height  = window_height - 40;
        $('#shell').css('margin', '20px 0 0 20px');
        $('#shell').css('height', shell_height + 'px');
        $('#shell').css('width',  shell_width + 'px');
        $('#prompt').css('width',  (shell_width - 2) + 'px');
    },
}
