// Here we pop open the wash object once again to patch in some tailored functionality.
wash.file = {
    up: function(){
        console.log('up');
    },

    down: function(){
        console.log('down');
    },
}
