describe("shell.history", function() {
    loadFixtures('index.html');

    it("should initialize to the appropriate values", function() {
        expect(shell.history.commands.length).toBe(0);
        expect(shell.history.current).toBe('');
        expect(shell.history.position).toBe(0);
    });

    it("should properly buffer the command history", function() {
        shell.history.add('command one');
        shell.history.add('command two');
        shell.history.add('command three');
        expect(shell.history.commands.length).toBe(3);
    });

    //it("should properly traverse the command history", function() {
    //  @todo: I'm having a hard time reading the DOM here
    //});
    
    it("should properly reset", function() {
        shell.history.reset();
        expect(shell.history.commands.length).toBe(0);
        expect(shell.history.current).toBe('');
        expect(shell.history.position).toBe(0);
    });
});
