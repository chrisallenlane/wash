// encapsulates the command prompt
shell.prompt = {

    // track command mode
    mode: {
        // I really don't like this whole "mode" thing
        state: 'shell',

        // gets the prompt mode
        get: function(){
            shell.debug.log('shell.prompt.mode.get');
            return shell.prompt.mode.state;
        },

        // sets the prompt mode
        set: function(mode){
            shell.debug.log('shell.prompt.mode.set');
            shell.prompt.mode.state = mode;

            // @todo: decouple these colors
            if(mode === 'wash'){
                shell.elements.prompt.css('color', 'lightgreen');
                shell.elements.prompt_context.css('color', 'lightgreen');
            }
            else{
                shell.elements.prompt.css('color', 'white');
                shell.elements.prompt_context.css('color', 'white');
            }
        },
    },

    // encapsulates the context before the prompt input
    context: {
        // clears the prompt context
        clear: function(){
            shell.debug.log('shell.prompt.context.clear');
            shell.elements.prompt_context.text('');
        },

        // gets the prompt context
        get: function(){
            shell.debug.log('shell.prompt.context.get');
            return shell.elements.prompt_context.text();
        },
        
        // sets the prompt context
        set: function(data){
            shell.debug.log('shell.prompt.context.set');
            shell.elements.prompt_context.text(data).text();
        },
    },

    // clears the command prompt
    clear: function(){
        shell.debug.log('shell.prompt.clear');
        shell.elements.prompt.val('');
    },

    // draws (mostly sizes) the command prompt
    draw: function(){
        shell.debug.log('shell.prompt.draw');
        var terminal_width       = shell.elements.terminal.width() - shell.padding;
        var prompt_context_width = shell.elements.prompt_context.width();
        var prompt_width         = terminal_width - prompt_context_width - (shell.padding * 2);
        shell.elements.prompt.css('width', prompt_width);
    },

    // enters a command
    enter: function(cmd_class){
        shell.debug.log('shell.prompt.enter');
        
        // capture and sanitize the output data
        var command = shell.prompt.get();
        var context = shell.prompt.context.get();
        var out     = $('<div/>').text(context + ' ' + command).html();

        // clear the prompt of the last command
        shell.prompt.clear();

        // add the command to the command history
        shell.history.add(command);

        // process the command
        wash.process(command);
    },

    // puts focus on the prompt box
    focus: function(){
        shell.elements.prompt.focus();
    },

    // gets the command prompt value
    get: function(){
        shell.debug.log('shell.prompt.get');
        return shell.elements.prompt.val().trim();
    },

    // sets the command prompt value
    set: function(data){
        shell.debug.log('shell.prompt.set');
        shell.elements.prompt.val(data);
    },
}
