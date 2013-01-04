// @note: these tests are currently stubs, was the wash.crypto object itself
// is currently a stub
describe("wash.crypto", function() {
    it("stub: should encrypt outbound communications", function() {
        expect(wash.crypto.encrypt('plaintext')).toBe('plaintext');
    });
    it("stub: should decrypt inbound communications", function() {
        expect(wash.crypto.decrypt('plaintext')).toBe('plaintext');
    });
});
