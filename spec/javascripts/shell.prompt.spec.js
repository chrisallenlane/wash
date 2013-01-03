describe("shell.prompt", function() {
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
        shell.prompt.set('new command');

        shell.prompt.enter();



        console.log($('#output').text());
        //shell.prompt.set('newer value');
        //expect(shell.prompt.get()).toBe('newer value');
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
