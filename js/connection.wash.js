// manage connections
wash.connection = {
    // @todo: I'm hard-coding these while debugging
    domain       : 'wash',
    protocol     : 'http',
    url          : '/trojans/plaintext/trojan.php',
    port         : '80',
    password     : '',
    request_type : 'post',

    // loads a saved connection
    load: function(){
        console.log('TODO: implement this.');
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
        console.log('TODO: implement this.');
    },

    // saves a connection under a new name
    saveas: function(){
        console.log('TODO: implement this.');
    },

    // updates a connection parameter
    set: function(parameter, value){

        // if the URL is being updated, parse out the domain first
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
