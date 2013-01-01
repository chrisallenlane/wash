def payload_feh json
    Dir.chdir @cwd
    img_file = json['args[file]'].first

    if File.readable? img_file
        mime_type = `file --mime-type -b #{img_file}`.strip!
        puts @cgi.header("Content-Type: #{mime_type}")
        puts File.read(img_file)
    else
        puts 'File does not exist.'
    end
    exit
end
