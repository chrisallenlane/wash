shell.editor = {
    // cancels changes in the editor
    cancel: function(){
        // @todo: flush the editor html here
        shell.status.set('Changes discarded.');
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

    // shows the editor
    show: function(){
        shell.elements.terminal.fadeOut('fast', function(){
            shell.elements.editor.fadeIn('slow');
        });
    },
}
