describe("wash.connection", function() {
    it("should initialize to the appropriate values", function() {
        expect(wash.connection.domain).toBe('');
        expect(wash.connection.protocol).toBe('http');
        expect(wash.connection.path).toBe('');
        expect(wash.connection.password).toBe('');
        expect(wash.connection.request_type).toBe('post');
    });

    it("should have a help function", function() {
        var help_text = wash.connection.help({"return":true});
        expect(help_text).not.toBe('');
    });

    it("should parse a URL into a domain and path", function() {
        parts = wash.connection.parse_url('example.com/path/to/the/page');
        expect(parts.domain).toBe('example.com');
        expect(parts.path).toBe('/path/to/the/page');
    });

    it("should set new connection parameters", function() {
        wash.connection.set('url'          , 'example.com/the/new/path');
        wash.connection.set('protocol'     , 'https');
        wash.connection.set('port'         , '443');
        wash.connection.set('password'     , 'my-new-password');
        wash.connection.set('request_type' , 'get');

        expect(wash.connection.domain).toBe('example.com');
        expect(wash.connection.protocol).toBe('https');
        expect(wash.connection.path).toBe('/the/new/path');
        expect(wash.connection.port).toBe('443');
        expect(wash.connection.password).toBe('my-new-password');
        expect(wash.connection.request_type).toBe('get');
    });
});
