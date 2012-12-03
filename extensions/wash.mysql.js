// Here we pop open the wash object once again to patch in some tailored
// functionality.
wash.mysql = {

    // this will begin an emulation of a mysql terminal
    connect: function(connection_parameters){
        $('body').animate({ backgroundColor : '#E97B00' }, 500);
        shell.status.set('Emulating mysql client.');
    },

    // disconnects from the terminal emulation
    disconnect: function(){
        $('body').animate({ backgroundColor : '#708090' }, 500);
        shell.status.set('Terminating mysql emulation.');
    },

    dump: function(){

    },
}
