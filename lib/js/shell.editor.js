shell.editor = {
    // cancels changes in the editor
    cancel: function(){
        // @todo: flush the editor html here
        shell.status.set('Changes discarded.');
    },

    // draws (mostly sizes) the editor
    draw: function(){
        // calculate the appropriate dimensions
        var editor_width  = $(window).width()  * .95;
        var editor_height = $(window).height() * .95;
        var margin_left   = $(window).width()  * .025;
        var margin_top    = $(window).height() * .025;

        // and set them
        shell.elements.editor_outer
            .height(editor_height)
            .width(editor_width)
            .css('margin-left' , margin_left + 'px')
            .css('top'         , margin_top  + 'px');

        shell.elements.editor
            .height(editor_height - 45)
            .css('margin-bottom', editor_height * .01)
            .css('margin-top', editor_height * .01);

        $('#editor_save')
            .css('margin-right', editor_height * .01);
    },

    // hides the editor
    hide: function(){
        shell.elements.editor_outer.fadeOut('slow');
    },

    // saves the editor changes
    save: function(){
        console.log('Save');
        // @todo: implement error-handling here.
        shell.status.set('Changes saved.');
    },

    // shows the editor
    show: function(){
        shell.elements.editor_outer.fadeIn('slow');
    },
}
