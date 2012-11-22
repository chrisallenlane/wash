// this is the top-level application object
var wash = {

    version: '1.0.0',

    // may use this to manage emulation
    mode:            : 'wash',

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
    }
}
