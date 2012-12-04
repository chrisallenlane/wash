/**
 * Encapsulates the sidebar functionality
 */
shell.sidebar = {
    // hides the sidebar
    hide: function(){
        // fade out the sidebar
        shell.elements.sidebar.fadeOut('slow', function(){
            // expand the terminal
            shell.elements.terminal.animate(
                {width: shell.terminal_width},
                'slow'
            );
            // redraw the prompt
            shell.prompt.draw();
        });
    },

    // shows the sidebar
    show: function(){
        // shrink the terminal
        shell.elements.terminal.animate(
            {width: shell.terminal_width * (1 - shell.sidebar_percentage)},
            'linear',

            // and then fade in the sidebar
            function(){
                shell.elements.sidebar.width((shell.terminal_width * shell.sidebar_percentage) - shell.padding * 3);
                shell.prompt.draw();
                shell.elements.sidebar.height(shell.terminal_height);
                shell.elements.sidebar.fadeIn();
            }
        );
    },
}
