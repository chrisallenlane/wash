// manage connections
wash.connection = {
    // active connection parameters
    domain       : '',
    protocol     : 'http',
    path         : '',
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
            var title = 'Connection ' + i + ' - ' +
                conns[i].protocol +
                '://'           +
                conns[i].domain +
                ':' + conns[i].port  +
                conns[i].path    +
                ' ('            + conns[i].request_type.toUpperCase() + ')';

            html += "<button title='" + title + "' class='wide' " + 
                "onclick='javascript:wash.connection.chosen({connection: " + i + "})'>" +
                 conns[i].domain +
                ':' + conns[i].port + 
                "</button>";
        }

        shell.elements.sidebar.html(html);
        shell.sidebar.show();
    },

    // callback after a connection has been chosen
    chosen: function(args){
        // programmer convenience
        var num = args.connection;
        var con = wash.permastore.storage.connections[args.connection];

        // load the new connection
        wash.connection.load({connection: num});

        // notify the user that a new connection has been specified
        var connection = con.protocol + '://' + con.domain + ':' + con.port + con.path;
        shell.status.set('Connected to ' + connection);

        // hide the sidebar
        shell.elements.sidebar.html('');
        shell.sidebar.hide();

        // return focus to the prompt
        shell.prompt.focus();
    },

    // deletes a connection
    delete: function(args){
        // remove the specified connection from the array of connections
        wash.permastore.storage.connections[args.connection] = null;

        // filter the array to remove "falsy" elements
        // @note: there's probably a faster way to do this (computationally),
        // but there's probably not a way to do this more concisely in code.
        // @see: http://stackoverflow.com/a/2843625/461108
        wash.permastore.storage.connections = $.grep(wash.permastore.storage.connections, function(n){
            return(n);
        });

        // save
        wash.permastore.save();

        // notify the user
        shell.status.set('Connection number ' + args.connection + ' deleted.');
    },

    // loads a saved connection
    load: function(args){
        // programmer convenience
        var con = wash.permastore.storage.connections[args.connection];

        // swap the connection parameters from the appropriate connection in storage
        if(con != null){
            // update the wash object
            wash.connection.domain       = con.domain;
            wash.connection.protocol     = con.protocol;
            wash.connection.path         = con.path;
            wash.connection.port         = con.port;
            wash.connection.password     = con.password;
            wash.connection.request_type = con.request_type;

            // update the shell UI elements
            shell.elements.protocol.val(con.protocol);
            shell.elements.url.val(con.domain + con.path);
            shell.elements.port.val(con.port);
            shell.elements.password.val(con.password);
            shell.elements.request_type.val(con.request_type);
            
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
            path          : wash.connection.path,
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
