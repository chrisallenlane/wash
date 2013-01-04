// tracks command history
shell.history = {
    
    // an array of historic commands
    commands: [],

    // a buffer for a command in-progress
    current: '', 

    // current position in commands
    position: 0,

    // adds a command to the history
    add: function(command){
        shell.history.commands.push(command); 
        shell.history.position++;
    }, 

    // moves backward (older) in history
    backward: function(){
        if(shell.history.position >= 1){
            // decrement the command history pointer
            shell.history.position--;
            shell.prompt.set(shell.history.commands[shell.history.position]);
        }
    },
    
    // moves forward (more recent) in history
    forward: function(){
        if(shell.history.position <= (shell.history.commands.length - 1)){
            shell.history.position++;
            shell.prompt.set(shell.history.commands[shell.history.position]);
        }
    },

    // reset the command history
    reset: function(){
        this.commands = [];
        this.current  = '';
        this.position = 0;
    },
};
