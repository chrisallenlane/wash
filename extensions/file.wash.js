// Here we pop open the wash object once again to patch in some tailored
// functionality.
wash.file = {
    up: function(){
        console.log('up');

        // assemble the command to send to the trojan
        wash.command.action = 'payload_blah';
        wash.command.cmd    = '';
        wash.command.args   = {one: 1, two: 2} ;

        // send the request upstream
        wash.send_and_receive();
    },

    down: function(){
        console.log('down');
        // assemble the command to send to the trojan
        wash.command.action = 'payload_laser';
        wash.command.cmd    = '';
        wash.command.args   = {one: 1, two: 2} ;

        // send the request upstream
        wash.send_and_receive();
    },
}
