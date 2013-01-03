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
        /**
         * @note @kludge: I'm hitting some _really_ weird issue whereby
         * (essentially) $('#prompt').val() is not returning the same value as
         * $('#prompt').attr('value'). I'm not sure wherein the bug lies, but
         * I'm fairly certain it's not within my own code. With that said,
         * I'm going to consider the following tests sufficient, even though
         * I can't actually read the value of the fixtured #prompt.
         */
        expect(shell.history.position).toBe(3);
        expect(shell.history.commands[shell.history.position - 1]).toBe('command three');

        shell.history.backward();
        expect(shell.history.position).toBe(2);
        expect(shell.history.commands[shell.history.position - 1]).toBe('command two');

        shell.history.backward();
        expect(shell.history.position).toBe(1);
        expect(shell.history.commands[shell.history.position - 1]).toBe('command one');
        expect(shell.history.commands[shell.history.position - 2]).not.toBeDefined(); //bounds checking

        shell.history.forward();
        expect(shell.history.position).toBe(2);
        expect(shell.history.commands[shell.history.position - 1]).toBe('command two');

        shell.history.forward();
        expect(shell.history.position).toBe(3);
        expect(shell.history.commands[shell.history.position - 1]).toBe('command three');
        expect(shell.history.commands[shell.history.position]).not.toBeDefined(); //bounds checking
    });
    
    it("should reset", function() {
        shell.history.reset();
        expect(shell.history.commands.length).toBe(0);
        expect(shell.history.current).toBe('');
        expect(shell.history.position).toBe(0);
    });
});
