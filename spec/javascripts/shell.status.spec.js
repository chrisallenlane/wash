describe("shell.status", function() {

    beforeEach(function() {
        loadFixtures('index.html');
        shell.init();
    });

    it("should get the status text", function() {
        expect(shell.status.get()).not.toBe('');
    });

    it("should set the status text", function() {
        runs(function(){
            shell.status.set('Testing the status notification.');
        });

        waits(1000);

        runs(function(){
            expect(shell.status.get()).toBe('Testing the status notification.');
        });
    });

    it("should clear the status text", function() {
        shell.status.clear();
        expect(shell.status.get()).toBe('');
    });
});
