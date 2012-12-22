<?php

# promote compatibility between PHP 4 and 5
if (!defined('T_ML_COMMENT')) { define('T_ML_COMMENT', T_COMMENT); }
else { define('T_DOC_COMMENT', T_ML_COMMENT); }

# remap (and track) variable names
$var_count = 0;
$remap     = array();

# do not remap certain variables
$tokens_to_ignore = array(
    '$_GET'       => 'true',
    '$_POST'      => 'true',
    '$_REQUEST'   => 'true',
    '$_SESSION'   => 'true',
    '__construct' => 'true',
    'false'       => 'true',
    'null'        => 'true',
    'true'        => 'true',
    'undefined'   => 'true',
);

# ----------------------------------------------------------------------------
# load the PHP source file
$source = file_get_contents($argv[1]);
$tokens = token_get_all($source);

# buffer the minified source
$buffer = '';

# iterate over the tokens
foreach ($tokens as $index => $token) {
    // simple 1-character token
    if (is_string($token)) { $buffer .= $token; }
   
    else {
        # extract the token information
        list($id, $text) = $token;

        # strip comments and newlines
        if(
            $id != T_COMMENT &&
            $id != T_ML_COMMENT &&
            $id != T_DOC_COMMENT
        ){
            # shorten variable names
            if($id == T_VARIABLE){
                # don't remap variables names that will cause problems, like
                # superglobal names
                if(!isset($tokens_to_ignore[$text])){
                    if(isset($remap[$id][$text])){ $text = $remap[$id][$text]; }
                    else {
                        $text = $remap[$id][$text] = '$_' . base_convert($var_count, 10, 36);
                        $var_count++;
                    }
                }
            }

            # shorten function names
            if($id == T_STRING){
                if(!isset($tokens_to_ignore[$text]) && !function_exists($text)){
                    if(isset($remap[$id][$text])){ $text = $remap[$id][$text]; }
                    else {
                        $text = $remap[$id][$text] = '_' . base_convert($var_count, 10, 36);
                        $var_count++;
                    }
                }
            }

            # buffer the text while stripping whitespace (but not completely)
            $text    = trim($text);
            $buffer .= ($text == '') ? ' ' : $text ;
        }
    }
}

# now that the new source has been minified and buffered, make a few final
# compressions

# allow no more than 1 space between tokens
$buffer = preg_replace('/\s\s+/', ' ', $buffer);

# remove spaces surrounding tokenizing characters
$buffer = preg_replace('/;\s/', ';', $buffer);
$buffer = preg_replace('/\}\s/', '}', $buffer);
$buffer = preg_replace('/\s\{/', '{', $buffer);

# output the result
echo $buffer;
