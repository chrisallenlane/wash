// for information on keybinding API, see:
// http://craig.is/killing/mice

// ctrl+l: clear the terminal output
Mousetrap.bind(['command+l', 'ctrl+l'], function(e) {
    shell.output.clear();
    return false;
});

// ctrl+p: focus on prompt
Mousetrap.bind(['command+l', 'ctrl+p'], function(e) {
    $('#prompt').focus();
    return false;
});
