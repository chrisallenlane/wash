describe("shell.prompt", function() {

    beforeEach(function() {
        loadFixtures('index.html');
        shell.init();
        jasmine.Ajax.useMock();
    });

    it("should set its value", function() {
        shell.prompt.set('new value');
        expect(shell.prompt.get()).toBe('new value');
    });

    it("should get its value", function() {
        shell.prompt.set('newer value');
        expect(shell.prompt.get()).toBe('newer value');
    });

    // @bug: I can't get the .toBeFocused() assertion to work either
    /*
    it("should focus", function() {
        shell.prompt.focus();
        expect(shell.elements.prompt).toBeFocused();
    });
    */

    it("should enter commands", function() {
        // clear the output
        shell.output.clear();

        // mock a new command
        shell.prompt.context.set('wash>');
        // use some html characters so we can assert that they
        // are NOT being html-encoded (&amp;, etc.)
        shell.prompt.set('new command | blah 2>&1');
        shell.prompt.enter();

        // expect the output to be written to the terminal
        expect($('#output').text()).toBe('wash> new command | blah 2>&1');
        // expect the prompt to be clear
        expect(shell.prompt.get()).toBe('');
        // expect there to be a command on the command history
        expect(shell.history.commands[0]).toBe("new command | blah 2>&1");
    });

    describe("mode object", function(){
        it("should get its value", function() {
            expect(shell.prompt.mode.get()).toBe('shell');
        });
    
        it("should set its value", function() {
            shell.prompt.mode.set('test');
            expect(shell.prompt.mode.get()).toBe('test');
        });
    });

    describe("context object", function(){
        it("should get its value", function() {
            shell.prompt.context.set('wash>');
            expect(shell.prompt.context.get()).toBe('wash>');
        });

        it("should set its value", function() {
            shell.prompt.context.set('wash#');
            expect(shell.prompt.context.get()).toBe('wash#');
        });

        it("should clear", function() {
            shell.prompt.context.clear();
            expect(shell.prompt.context.get()).toBe('');
        });

        // @todo: write tests for shell.prompt.context.show() and 
        // shell.prompt.context.hide(). I'm having trouble getting the
        // jasmine-jquery .toBeVisible() assertion to behave as expected,
        // so I'm moving on for now.
    
    });
});
