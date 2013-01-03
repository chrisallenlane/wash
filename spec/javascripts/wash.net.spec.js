describe("wash.net", function() {
    var request;

    beforeEach(function() {
        loadFixtures('index.html');
        shell.init();

        jasmine.Ajax.useMock();
    });

    /*
    it("get() should invoke a custom callback", function() {
        request = mostRecentAjaxRequest();
        request.response(test_responses.dummy.success);
        console.log(request);

        //runs(function(){
            wash.net.get(function(response){
                console.log('I was called!');
                console.log(response);
            });
        //});
    });
    */

    it("should receive inbound communications", function(){
        wash.net.receive('{"output":"mock output"}', function(){return void(0);});
        expect(wash.response.output).toBe('mock output');
    });
});
