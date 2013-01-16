describe("wash.response", function(){
    /**
     * @note: there's obviously not a lot of functionality to test here. I'm
     * just checking to make sure the object has the appropriate schema.
     */
    it("should have the appropriate schema", function(){
        expect(wash.response).not.toBe(undefined);
        expect(wash.response.error).not.toBe(undefined);
        expect(wash.response.output).not.toBe(undefined);
        expect(wash.response.output.cwd).not.toBe(undefined);
        expect(wash.response.output.prompt).not.toBe(undefined);
        expect(wash.response.output.stdout).not.toBe(undefined);
    });
});
