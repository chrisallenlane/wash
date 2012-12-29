shell.editor = {

    // the file currently being edited
    edit_file: '',

    // map file extensions to editor modes
    modes: {
        cpp      : 'cpp',
        cpp      : 'c_cpp',
        cpp      : 'coffee',
        cf       : 'coldfusion',
        cs       : 'csharp',
        css      : 'css',
        diff     : 'diff',
        haml     : 'haml',
        html     : 'html',
        java     : 'java',
        js       : 'javascript',
        json     : 'json',
        jsp      : 'jsp',
        jsx      : 'jsx',
        latex    : 'latex',
        less     : 'less',
        lisp     : 'lisp',
        lua      : 'lua',
        md       : 'markdown',
        markdown : 'markdown',
        pl       : 'perl',
        php      : 'php',
        php4     : 'php',
        php5     : 'php',
        py       : 'python',
        rhtml    : 'rhtml',
        rb       : 'ruby',
        sh       : 'sh',
        sql      : 'sql',
        svg      : 'svg',
        tcl      : 'tcl',
        tex      : 'tex',
        txt      : 'text',
        txt      : 'textile',
        xml      : 'xml',
        yaml     : 'yaml',
    },

    initialize: function(){
        // initialize the editor
        editor = ace.edit('editor');
        editor.setTheme('ace/theme/monokai');

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

    // edits a file on the server
    edit: function(args){
        // clear the editor
        editor.setValue('');

        // read the contents of the file
        wash.command.action        = 'payload_file_read';
        wash.command.args          = args;
        wash.command.args.password = wash.connection.password;

        wash.net.get(function(response){
            // unpack the response object from the trojan
            json = JSON.parse(response);

            // handle errors if they occur
            if(json.error != null){
                 shell.output.write(json.error, 'output wash_error'); 
            }

            // otherwise, launch the editor
            else {
                shell.editor.edit_file = json.output.file;

                // load the file contents into the editor
                editor.setValue(json.output.output);
                shell.editor.show();
                shell.editor.focus();
            }
        });
    }, 

    // puts focus on the editor
    focus: function(){
        shell.elements.editor.focus();
    },

    // hides the editor
    hide: function(){
        shell.elements.editor.fadeOut('fast', function(){
            shell.elements.terminal.fadeIn('slow');
            shell.draw();
            shell.prompt.focus();
        });
    },

    // toggles between the editor and shell views
    mode: function(){
        if(shell.elements.editor.is(':visible')){
           shell.editor.hide(); 
        } else {
           shell.editor.show(); 
        }
    },

    // quits the editor
    quit: function(){
        // @todo: implement "unsaved changes" functionality here
        editor.setValue('');
        shell.editor.hide();
        shell.status.set('Editor closed.');
    },

    // saves the editor changes
    save: function(){
        wash.command.action        = 'payload_file_write';
        // if the newline is not appended below, bad things seem to happen. See issue #39.
        wash.command.args          = {file: shell.editor.edit_file, data: editor.getValue() + "\n"};
        wash.command.args.password = wash.connection.password;

        wash.net.send(function(){
            // display a notice in the status bar
            if(wash.response.error != null){
                shell.status.set(wash.response.error);
            }
            else { shell.status.set(wash.response.output); }
        });
    },

    // shows the editor
    show: function(){
        shell.elements.terminal.fadeOut('fast', function(){
            // reveal the editor
            shell.elements.editor.fadeIn('slow');

            // enable syntax highlighting based off file extension
            var extension = wash.file.get_extension(shell.editor.edit_file);
            if(shell.editor.modes[extension] != null){
                editor.getSession().setMode('ace/mode/' + shell.editor.modes[extension]);
            } 
        
            // give focus to the editor
            shell.draw();
            shell.prompt.focus();

            // show the user the editor commands
            var help = 'Editor activated. Commands: ';
            help += 'Save: Ctrl+S | ';
            help += 'Quit: Ctrl+Q | ';
            help += 'Change Mode: Ctrl+M ';
            shell.status.set(help);
        });
    },
}

// initialize the editor on document ready
$(document).ready(function(){
    // write the editor div into the document

    console.log('within plugin');
    //console.log(shell.elements);


    //console.log(shell.elements.terminal);
    //$(shell.elements.terminal).after("<div id='editor'></div>");
    //$('#terminal').after("<div id='editor'></div>");

    // register the editor div with the shell object
    //shell.elements.editor = '#editor';
    
    // initialize
    //shell.editor.initialize();
    
    // size the terminal
    /*
    shell.elements.editor
        .css('height'     , terminal_height)
        .css('max-height' , terminal_height);
    */
});
