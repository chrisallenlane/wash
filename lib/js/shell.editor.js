shell.editor = {

    initialize: function(){
        // initialize the editor
        editor = ace.edit('editor');
        editor.setTheme('ace/theme/monokai');
        //editor.getSession().setMode('ace/mode/javascript');

        // initialize some keyboard shortcuts
        editor.commands.addCommand({
            name: 'save',
            bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
            exec: function(editor) {
                shell.editor.save();
            }
        });
        editor.commands.addCommand({
            name: 'quit',
            bindKey: {win: 'Ctrl-Q',  mac: 'Command-Q'},
            exec: function(editor) {
                shell.editor.quit();
            }
        });
        editor.commands.addCommand({
            name: 'mode',
            bindKey: {win: 'Ctrl-M',  mac: 'Command-M'},
            exec: function(editor) {
                shell.editor.mode();
            }
        });
    },

    // cancels changes in the editor
    quit: function(){
        // @todo: implement "unsaved changes" functionality here
        editor.setValue('');
        shell.editor.hide();
        shell.status.set('Editor closed.');
    },

    // hides the editor
    hide: function(){
        shell.elements.editor.fadeOut('fast', function(){
            shell.elements.terminal.fadeIn('slow');
        });
    },

    // saves the editor changes
    save: function(){
        console.log('Save');
        // @todo: implement error-handling here.
        shell.status.set('Changes saved.');
    },

    // toggles between the editor and shell views
    mode: function(){
        if(shell.elements.editor.is(':visible')){
           shell.editor.hide(); 
           shell.prompt.focus();
        } else {
           shell.editor.show(); 
        }
    },

    // shows the editor
    show: function(){
        shell.elements.terminal.fadeOut('fast', function(){
            // reveal the editor
            shell.elements.editor.fadeIn('slow');

            // show the user the editor commands
            var help = 'Editor activated. Commands: ';
            help += 'Save: Ctrl+S | ';
            help += 'Quit: Ctrl+Q | ';
            help += 'Change Mode: Ctrl+M ';
            shell.status.set(help);
        });
    },
}
