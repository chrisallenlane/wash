describe("shell.output", function() {
    it("should write", function() {
        shell.output.clear();
        shell.output.write('test output', 'test-class');
        expect(shell.elements.output.html()).toBe('<div class="test-class">test output</div>');
    });

    it("should clear", function() {
        shell.output.clear();
        expect(shell.elements.output.html()).toBe('');
    });
});
