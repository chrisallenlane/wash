describe("wash.net", function() {
    var request;

    /*
    beforeEach(function() {
        loadFixtures('index.html');
        shell.init();
        jasmine.Ajax.useMock();
    });
    */

    /**
     * @bug @kludge: I can't seem to write successful tests for wash.net.get
     * and wash.net.send, because the .done() chained method does not seem to
     * be firing. My best guess is that the AJAX mocking library simply does not
     * support this. The only good news here is that bugs in either of those
     * two methods are likely to be extremely conspicuous, so are unlikely
     * to go unnoticed until I figure out a way to resolve this problem.
     */

    it("should receive inbound communications", function(){
        wash.net.receive('{"output":"mock output"}', function(){return void(0);});
        expect(wash.response.output).toBe('mock output');
    });
});
