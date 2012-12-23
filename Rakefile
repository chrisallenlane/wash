namespace :less do

    desc "Compiles the less into css"
    task :compile do
        `lessc './lib/css/main.less' > './lib/css/main.css'`
        puts 'Less compiled.'
    end

end

namespace :trojan do

    desc "Compiles the trojan into a minified and obfuscated form."
    task :compile do
        puts `php -f ./lib/build/obfuscate.php './trojans/plaintext/trojan.php' > ./trojans/obfuscated/o.php`
    end

end
