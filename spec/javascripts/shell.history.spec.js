describe("shell.history", function() {
    it("should initialize to the appropriate values", function() {
        expect(shell.history.commands.length).toBe(0);
        expect(shell.history.current).toBe('');
        expect(shell.history.position).toBe(0);
    });

    it("should buffer the command history", function() {
        shell.history.add('command one');
        shell.history.add('command two');
        shell.history.add('command three');
        expect(shell.history.commands.length).toBe(3);
    });

    it("should traverse the command history", function() {
        loadFixtures('index.html');
        shell.init();

        expect(shell.history.position).toBe(3);
        expect(shell.prompt.get()).toBe('');

        shell.history.backward();
        expect(shell.history.position).toBe(2);
        expect(shell.prompt.get()).toBe('command three');

        shell.history.backward();
        expect(shell.history.position).toBe(1);
        expect(shell.prompt.get()).toBe('command two');

        shell.history.backward();
        expect(shell.history.position).toBe(0);
        expect(shell.prompt.get()).toBe('command one');

        shell.history.forward();
        expect(shell.history.position).toBe(1);
        expect(shell.prompt.get()).toBe('command two');

        shell.history.forward();
        expect(shell.history.position).toBe(2);
        expect(shell.prompt.get()).toBe('command three');

        shell.history.forward();
        expect(shell.history.position).toBe(3);
        expect(shell.prompt.get()).toBe('');
    });
    
    it("should reset", function() {
        shell.history.reset();
        expect(shell.history.commands.length).toBe(0);
        expect(shell.history.current).toBe('');
        expect(shell.history.position).toBe(0);
    });
});
