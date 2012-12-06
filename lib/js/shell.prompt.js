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

            // set distinct mode colors
            if(mode === 'wash' || mode === 'remap'){
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

        // visually hides the prompt context
        hide: function(){
            shell.elements.prompt_context.hide();
        },
        
        // sets the prompt context
        set: function(data){
            shell.debug.log('shell.prompt.context.set');
            shell.elements.prompt_context.text(data).text();
        },

        // visually shows the prompt context
        hide: function(){
            shell.elements.prompt_context.show();
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
    enter: function(){
        shell.debug.log('shell.prompt.enter');
        
        // Sanitize the prompt, but not the prompt context. I don't want
        // contexts like `mysql>` and such getting escaped. Realistically,
        // nothing too harmful will likely be injected here under normal 
        // circumstances.
        var context       = shell.prompt.context.get();
        var command       = shell.prompt.get();
        var command_clean = $('<div/>').text(command).html();
        var out           = context + ' ' + command_clean;

        // then write it to the command history
        shell.output.write(out, shell.prompt.mode.get());

        // clear the prompt of the last command
        shell.prompt.clear();

        // if the prompt was previously in wash mode, don't wait for a keypress
        // to change it back to its default color
        shell.elements.prompt.css('color', 'white');
        shell.elements.prompt_context.css('color', 'white');

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

    // visually hides the prompt
    hide: function(){
        shell.elements.prompt.hide();
    },

    // sets the command prompt value
    set: function(data){
        shell.debug.log('shell.prompt.set');
        shell.elements.prompt.val(data);
    },
    
    // visually shows the prompt
    show: function(){
        shell.elements.prompt.show();
    },
}
