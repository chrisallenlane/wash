/**
 * @note: code coverage is hard to implement here, because a lot of this
 * functionality depends on having a working database connection. I'll revisit
 * these tests when I can think of a satisfactory way to mock the environment.
 */
describe("wash.sqlite3", function() {
    it("should initialize to appropriate defaults", function() {
        expect(wash.sqlite3.cmd).toBe('');
        expect(wash.sqlite3.prompt).toBe('sqlite>');
        expect(wash.sqlite3.connection.file).toBe('');
    });

    it("should have a help function", function() {
        var help_text = wash.sqlite3.help({"return":true});
        expect(help_text).not.toBe('');
    });
});
