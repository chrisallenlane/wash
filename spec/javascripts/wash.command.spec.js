describe("wash.command", function(){
    /**
     * @note: there's obviously not a lot of functionality to test here. I'm
     * just checking to make sure the object has the appropriate schema.
     */
    it("should have the appropriate schema", function(){
        expect(wash.command).not.toBe(undefined);
        expect(wash.command.action).not.toBe(undefined);
        expect(wash.command.args).not.toBe(undefined);
        expect(wash.command.args.cmd).not.toBe(undefined);
        expect(wash.command.args.cwd).not.toBe(undefined);
    });
});
