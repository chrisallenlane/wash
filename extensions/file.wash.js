// Here we pop open the wash object once again to patch in some tailored
// functionality.
wash.file = {
    up: function(){
        console.log('up');

        // assemble the command to send to the trojan
        wash.command.obj.action = 'payload_laser';
        wash.command.obj.cmd    = '';
        wash.command.obj.args   = {one: 1, two: 2} ;

        // send the request upstream
        wash.command.send();
    },

    down: function(){
        console.log('down');
    },
}
