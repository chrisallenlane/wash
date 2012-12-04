wash.test = {

    payload: function(){
        // assemble the command to send to the trojan
        wash.command.action = 'payload_test_payload';
        wash.command.args   = {} ;
        wash.net.send(function(){  
            // display the output
            shell.prompt.context.set(wash.response.prompt_context);
            shell.prompt.draw();

            // display output or error, depending on which was received
            if(wash.response.error != null){ shell.output.write(wash.response.error, 'output wash_error'); }
            else { shell.output.write(wash.response.output, 'output'); }
        });
    },

}
