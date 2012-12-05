// manage connections
wash.connection = {
    // @todo: I'm hard-coding these while debugging
    domain       : 'wash',
    protocol     : 'http',
    url          : '/trojans/plaintext/trojan.php',
    port         : '80',
    password     : '',
    request_type : 'post',

    // prompt the user to choose a connection
    choose: function(){
        // map the saved connections to a terse local variable for convenience
        var conns = wash.permastore.storage.connections;

        // if there are no saved connections, say so and die
        if(conns.length === 0){
            shell.output.write('There are no saved connections. Please specify new connection parameters above.', 'output wash_error');
            return false;
        }

        // otherwise, print the saved connections
        var html = '<p>Choose a Connection:</p>';
        for(i = 0; i < conns.length; i++){
            html += "<button class='wide'>" + conns[i].domain + ':' + conns[i].port + "</button>";
        }

        shell.elements.sidebar.html(html);
        shell.sidebar.show();
    },

    // loads a saved connection
    load: function(args){
        // swap the connection parameters from the appropriate connection in storage
        if(wash.permastore.storage.connections[args.connection] != null){
            wash.connection.domain       = wash.permastore.storage.connections[args.connection].domain;
            wash.connection.protocol     = wash.permastore.storage.connections[args.connection].protocol;
            wash.connection.url          = wash.permastore.storage.connections[args.connection].url;
            wash.connection.port         = wash.permastore.storage.connections[args.connection].port;
            wash.connection.password     = wash.permastore.storage.connections[args.connection].password;
            wash.connection.request_type = wash.permastore.storage.connections[args.connection].request_type;
            
            // notify the user
            shell.status.set('Connection loaded');
        } 

        else {
            shell.status.set('Invalid connection specified.');
        }
    },

    // parses a url into a domain and path
    parse_url: function(url){
        // initialize some vars for parsing
        var domain, path; domain = path = '';
        var first_slash_position = url.indexOf('/');

        // if the url contains no path, manually specify path as /
        if(first_slash_position  == -1){
            domain = url;
            path   = '/';
        }

        // otherwise, parse
        else{
            domain = url.substr(0, first_slash_position);
            path   = url.substr(first_slash_position);
        }
        
        // structure and return the result
        var parts = {
            domain : domain,
            path   : path,
        }
        return parts;
    },

    // saves a connection
    save: function(){
        // created a new saved connection object
        var saved_connection = {
            domain       : wash.connection.domain,
            protocol     : wash.connection.protocol,
            url          : wash.connection.url,
            port         : wash.connection.port,
            password     : wash.connection.password,
            request_type : wash.connection.request_type,
        };

        // and push it onto the permastore
        wash.permastore.storage.connections.push(saved_connection);
        wash.permastore.save();

        // notify the user
        shell.status.set('Connection saved.');
    },

    // updates a connection parameter
    set: function(parameter, value){

        // if the URL is being updated, parse out the domain first
        // @todo: this needs to sync the UI element values as well
        if(parameter == 'url'){
            var url_parts = this.parse_url(value);
            wash.connection.domain = url_parts.domain;
            wash.connection.path   = url_parts.path;
            shell.status.set(
                'wash.connection.domain has been set to ' + url_parts.domain + '. ' + 
                'wash.connection.path has been set to '   + url_parts.path   + '.'
            );
        }

        // otherwise, just set the parameter as a scalar
        else {
            wash.connection[parameter] = value;
            shell.status.set('wash.connection.' + parameter + ' has been set to ' + value + '.');
        }
    },
}
