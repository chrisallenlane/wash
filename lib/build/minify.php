<?php

/**
 * I'm pretty sure this somewhat naive obfuscator won't work in all cases,
 * but it seems to be working well enough for my purposes here. (I think it
 * it will fail if asked to minify a file containing more than one class, 
 * though.)
 */

function minify($file){
    # promote compatibility between php 4 and 5
    if (!defined('T_ML_COMMENT')) { define('T_ML_COMMENT', T_COMMENT); }
    else { define('T_DOC_COMMENT', T_ML_COMMENT); }

    # remap (and track) variable names
    $var_count = 0;
    $remap     = array();

    # do not remap certain variables
    # @note: all custom payload names must be added to this list. Otherwise,
    # they will not be invokable from the wash interface.
    $tokens_to_ignore = array(
        '$GLOBALS'              => 'true',
        '$HTTP_RAW_POST_DATA'   => 'true',
        '$_COOKIE'              => 'true',
        '$_ENV'                 => 'true',
        '$_FILES'               => 'true',
        '$_GET'                 => 'true',
        '$_POST'                => 'true',
        '$_REQUEST'             => 'true',
        '$_SERVER'              => 'true',
        '$_SESSION'             => 'true',
        '$argc'                 => 'true',
        '$argv'                 => 'true',
        '$http_response_header' => 'true',
        '$php_errormsg'         => 'true',
        '$this'                 => 'true',
        '__construct'           => 'true',
        'false'                 => 'true',
        'null'                  => 'true',
        'parent'                => 'true',
        'payload_file_down'     => 'true',
        'payload_file_read'     => 'true',
        'payload_file_up'       => 'true',
        'payload_file_view'     => 'true',
        'payload_file_write'    => 'true',
        'payload_image_view'    => 'true',
        'self'                  => 'true',
        'super'                 => 'true',
        'true'                  => 'true',
        'undefined'             => 'true',
    );

    # ----------------------------------------------------------------------------
    # load the php source file
    $source = file_get_contents($file);
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
                        # pre-process the text
                        $text = str_replace('$', '', $text);

                        # remap the variable name if it has already been set
                        if(isset($remap[$id][$text])){ $text = '$' . $remap[$id][$text]; }

                        # otherwise, create a new mapping
                        else {
                            $remap[$id][$text] = base52_encode($var_count);
                            $text              = '$' . $remap[$id][$text];
                            $var_count++;
                        }
                    }
                }

                # shorten member and method names
                else if($id == T_STRING){
                    # ignore tokens that have been specified to be ignored, as well
                    # as native php function calls. if we rename the latter, the
                    # application will break.
                    if(!isset($tokens_to_ignore[$text]) && !function_exists($text)){
                        # peek into the previous token
                        list($last_id, $last_token) = $tokens[$index - 1];
                        
                        # if this is an object member, map it to the variable 
                        # substitution table. (the following should screen out
                        # method calls, i think):
                        if($last_id == T_OBJECT_OPERATOR && $tokens[$index + 1] != '('){
                            # remap as a variable if this is a member, and a remap
                            # has already been specified
                            $id = T_VARIABLE;
                            if(isset($remap[$id][$text])){ $text = $remap[$id][$text]; }

                            # otherwise, remap as a member, but create a new remap
                            else {
                                $text = $remap[$id][$text] = base52_encode($var_count);
                                $var_count++;
                            }
                        }

                        # if this is not an object member, map it as a function
                        else {
                            if(isset($remap[$id][$text])){ $text = $remap[$id][$text]; }
                            else {
                                $text = $remap[$id][$text] = base52_encode($var_count);
                                $var_count++;
                            }
                        }
                    }
                }

                # buffer the text
                $buffer .= $text;
            }
        }
    }

    # now that the new source has been minified and buffered, strip out any 
    # unnecessary remaining whitespace

    # allow no more than 1 space between tokens
    $buffer = preg_replace('/\s\s+/', ' ' , $buffer);

    # remove spaces surrounding tokenizing characters
    $buffer = preg_replace('/;\s/'  , ';' , $buffer);
    $buffer = preg_replace('/\{\s/' , '{' , $buffer);
    $buffer = preg_replace('/\s\}/' , '}' , $buffer);
    $buffer = preg_replace('/\(\s/' , '(' , $buffer);
    $buffer = preg_replace('/\s\)/' , ')' , $buffer);

    //file_put_contents('/home/chris/Source/www/projects/wash/trojans/obfuscated/debug.php', $buffer);

    # output the result
    return $buffer;
}


/* Converts a number to base 52, which uses letters only. */
function base52_encode($n){
    # metaprogram (and sort) a map
    $map = array();
    for($i = 0; $i < 26; $i++){
        $map[$i]      = chr(97 + $i);
        $map[$i + 26] = strtoupper($map[$i]);
    }
    ksort($map);

    # buffer the encoded conversion string
    $encoded = '';
    while($n >= 52){
        $encoded .= 'Z';
        $n -= 52;
    }
    $encoded .= $map[$n];

    # return the result
    return $encoded;
}
