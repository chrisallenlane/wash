// encapsulates the command prompt
shell.prompt = {

    // track command mode
    mode: {
        // I really don't like this whole "mode" thing
        state: 'shell',

        // gets the prompt mode
        get: function(){
            return shell.prompt.mode.state;
        },

        // sets the prompt mode
        set: function(mode){
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
            shell.elements.prompt_context.text('');
        },

        // gets the prompt context
        get: function(){
            return shell.elements.prompt_context.text();
        },

        // visually hides the prompt context
        hide: function(){
            shell.elements.prompt_context.hide();
        },
        
        // sets the prompt context
        set: function(data){
            shell.elements.prompt_context.text(data).text();
        },

        // visually shows the prompt context
        show: function(){
            shell.elements.prompt_context.show();
        },
    },

    // clears the command prompt
    clear: function(){
        shell.elements.prompt.val('');
    },

    // draws (mostly sizes) the command prompt
    draw: function(){
        var terminal_width       = shell.elements.terminal.width() - shell.padding;
        var prompt_context_width = shell.elements.prompt_context.width();
        var prompt_width         = terminal_width - prompt_context_width - (shell.padding * 2);
        shell.elements.prompt.css('width', prompt_width);
    },

    // enters a command
    enter: function(){
        // don't sanitize anything here, because the sanitization will occur
        // in shell.output.write
        var context       = shell.prompt.context.get();
        var command       = shell.prompt.get();
        var out           = context + ' ' + command;

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
        return shell.elements.prompt.val().trim();
    },

    // visually hides the prompt
    hide: function(){
        shell.elements.prompt.hide();
    },

    // sets the command prompt value
    set: function(data){
        shell.elements.prompt.val(data);
    },
    
    // visually shows the prompt
    show: function(){
        shell.elements.prompt.show();
    },
};
