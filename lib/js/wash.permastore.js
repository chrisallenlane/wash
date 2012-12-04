/**
 * Saves data to persistent storage
 */
wash.permastore = {
    // storage is what gets saved into persistent storage
    storage: {
        // save trojan connections
        connections: [],
    },

    // initialize the persistent storage
    init: function(){
        // if a save file exists, load it
        if(localStorage.wash != null){ this.load(); }
        // otherwise, save initialized defaults
        else { this.save(this.storage); }
    }, 

    // saves permastore to persistent storage
    save: function(){
        // write to disk
        localStorage.wash = JSON.stringify(this.storage);
    },

    // loads permastore from persistent storage
    load: function(){
        this.storage = JSON.parse(localStorage.wash);
    },
}
