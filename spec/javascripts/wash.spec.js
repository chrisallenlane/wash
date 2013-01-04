describe("wash", function() {

    it("should initialize with appropriate defaults", function(){
        expect(wash.command_root).toBe('');
        expect(wash.version).not.toBe('');
    });

    describe("process()", function(){

        beforeEach(function() {
            loadFixtures('index.html');
            shell.init();
            //jasmine.Ajax.useMock();
        });

        describe("wash mode", function(){
            it("should evaluate JavaScript macros when in wash mode", function(){
                process_test_var = false;
                shell.prompt.mode.set('wash');
                wash.process('process_test_var = true');
                expect(process_test_var).toBe(true);
            });
        
            it("should fail gracefully when fed bad JavaScript in wash mode", function(){
                shell.prompt.mode.set('wash');
                //
                // clear the terminal output
                shell.elements.output.html('');
                wash.process('not-a-var / 0');
                output_text = shell.elements.output.text();
                expect(output_text).toBe('wash error: Invalid command.');
            });
        });

        describe("shell mode", function(){
            it("should honor command remaps", function(){
                // mock a command remap
                wash.remap_test_var = false;
                wash.remap.test = {
                    callback : function(){ wash.remap_test_var = true },
                    command  : false,
                };

                // flip wash into remap mode
                shell.prompt.mode.set('remap');
                // do this manually, because the shell.key-monitor does it
                // under normal circumstances
                wash.command_root = 'test';
                
                // assert that the callback was executed
                wash.process('test');
                expect(wash.remap_test_var).toBe(true);
            });

            it("should send outbound shell commands", function(){
                jasmine.Ajax.useMock();

                shell.prompt.mode.set('shell');
                wash.command_root = 'ls';
                wash.process('ls');

                //@todo @bug: this isn't working
                //spyOn(wash.net, 'send');

                expect(wash.command.action).toBe('shell');
                expect(wash.command.cmd).toBe('ls');
                //expect(wash.net.send).toHaveBeenCalled();
            });
        });
    });
});
