wash.response = {
    // this is a buffer for the response from the trojan
    obj: new Response(),

    // displays response data to the wash interface
    display: function(output_class){
        //decrypt here
        shell.prompt.context.set(wash.response.obj.prompt_context);
        shell.output.write(wash.response.obj.output , 'output ' + output_class);
    },
}
