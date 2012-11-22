// this is the top-level application object
// @todo: remember to segregate wash into a local and remote namespace pair
var wash = {

    // store the version number (sometimes this is handy)
    version: '1.0.0',

    // may use this to manage emulation
    mode            : 'wash',

    command: {

        encrypt: function(){

        },
        decrypt: function(){

        },
        interpret: function(command){
            console.log('Interpreting command.');
        },
        package: function(){

        },
        send: function(){
            // do a check for a good connection
        },

    },

    // manage connections
    connection: {
        load: function(){
            console.log('TODO: implement this.');
        },
        save: function(){
            console.log('TODO: implement this.');
        },
        saveas: function(){
            console.log('TODO: implement this.');
        },
    },

    // target parameters
    target: {
        protocol     : '',
        url          : '',
        port         : '',
        password     : '',
        request_type : '',

        // updates a target parameter
        update: function(parameter, value){
            wash.target[parameter] = value;
            shell.status.set('wash.target.' + parameter + ' has been set to ' + value + '.');
        },
    },
}
