// manage connections
wash.connection = {
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
}
