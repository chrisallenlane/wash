// for information on keybinding API, see:
// http://craig.is/killing/mice

// ctrl+h: toggles target bar visibility
Mousetrap.bind(['command+h', 'ctrl+h'], function(e) {
    shell.target.toggle();
    return false;
});

// ctrl+l: clear the terminal output
Mousetrap.bind(['command+l', 'ctrl+l'], function(e) {
    shell.output.clear();
    return false;
});

// ctrl+p: focus on prompt
Mousetrap.bind(['command+p', 'ctrl+p'], function(e) {
    $(shell.elements.prompt).focus();
    return false;
});

// up: move back in command history
Mousetrap.bind('up', function(e) {
    shell.command.history.backward();
    return false;
});

// down: move forward in command history
Mousetrap.bind('down', function(e) {
    shell.command.history.forward();
    return false;
});
