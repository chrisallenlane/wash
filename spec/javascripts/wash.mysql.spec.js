/**
 * @note: code coverage is hard to implement here, because a lot of this
 * functionality depends on having a working database connection. I'll revisit
 * these tests when I can think of a satisfactory way to mock the environment.
 */
describe("wash.mysql", function() {
    it("should initialize to appropriate defaults", function() {
        expect(wash.mysql.cmd).toBe('');
        expect(wash.mysql.prompt).toBe('mysql>');
        expect(wash.mysql.connection.username).toBe('root');
        expect(wash.mysql.connection.password).toBe('root');
        expect(wash.mysql.connection.database).toBe('');
    });

    it("should have a help function", function() {
        var help_text = wash.mysql.help({"return":true});
        expect(help_text).not.toBe('');
    });
});
