<?php

class TinyAndWeird{
    # remap and track variable names
    private $b52_map   = array();
    private $options   = array(
        'tokens_to_ignore'  => array(),
        'remove_whitespace' => true,
    );
    private $remap     = array();
    private $var_count = 0;

    # do not remap certain variables and keywords
    private $tokens_to_ignore = array(
        '$GLOBALS'              => true, '$HTTP_RAW_POST_DATA'   => true,
        '$_COOKIE'              => true, '$_ENV'                 => true,
        '$_FILES'               => true, '$_GET'                 => true,
        '$_POST'                => true, '$_REQUEST'             => true,
        '$_SERVER'              => true, '$_SESSION'             => true,
        '$argc'                 => true, '$argv'                 => true,
        '$http_response_header' => true, '$php_errormsg'         => true,
        '$this'                 => true, '__construct'           => true,
        'false'                 => true, 'null'                  => true,
        'parent'                => true, 'self'                  => true,
        'super'                 => true, 'true'                  => true,
        'undefined'             => true,
    );

    /**
     * Initializes the minifier.
     */
    public function __construct($options = array()){
        # promote compatibility between php 4 and 5
        if (!defined('T_ML_COMMENT')) { define('T_ML_COMMENT', T_COMMENT); }
        else { define('T_DOC_COMMENT', T_ML_COMMENT); }

        # metaprogram (and sort) a map
        for($i = 0; $i < 26; $i++){
            $this->b52_map[$i]      = chr(97 + $i);
            $this->b52_map[$i + 26] = strtoupper($this->b52_map[$i]);
        }
        ksort($this->b52_map);

        # store options
        if(isset($options['remove_whitespace'])){
            $this->options['remove_whitespace'] = $options['remove_whitespace'];
        }

        # add to the list of tokens to ignore
        if(!empty($options['tokens_to_ignore'])){
            foreach($options['tokens_to_ignore'] as $token){
                $this->tokens_to_ignore[$token] = true;
            }
        }
    }

    /**
     * Minifies the specified file.
     *
     * @param string $filename         The path to the file to minify
     */
    public function minify($file){
        # load the php source file
        $source = file_get_contents($file);
        $tokens = token_get_all($source);

        # buffer the minified source
        $buffer = '';

        # iterate over the tokens
        foreach ($tokens as $index => $token) {
            # just buffer the simple one-character tokens
            if (is_string($token)) { $buffer .= $token; }
           
            # and process the more substantive ones
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
                        if(!isset($this->tokens_to_ignore[$text])){
                            # pre-process the text
                            $text = str_replace('$', '', $text);

                            # remap the variable name if it has already been set
                            if(isset($this->remap[$id][$text])){ $text = '$' . $this->remap[$id][$text]; }

                            # otherwise, create a new mapping
                            else {
                                $this->remap[$id][$text] = $this->base52_encode($this->var_count);
                                $text                    = '$' . $this->remap[$id][$text];
                                $this->var_count++;
                            }
                        }
                    }

                    # shorten member and method names
                    else if($id == T_STRING){
                        # ignore tokens that have been specified to be ignored, as well
                        # as native php function calls. if we rename the latter, the
                        # application will break.
                        if(!isset($this->tokens_to_ignore[$text]) && !function_exists($text)){
                            # peek into the previous token
                            list($last_id, $last_token) = $tokens[$index - 1];
                            
                            # if this is an object member, map it to the variable 
                            # substitution table. (the following should screen out
                            # method calls, i think):
                            if($last_id == T_OBJECT_OPERATOR && $tokens[$index + 1] != '('){
                                # remap as a variable if this is a member, and a remap
                                # has already been specified
                                $id = T_VARIABLE;
                                if(isset($this->remap[$id][$text])){ $text = $this->remap[$id][$text]; }

                                # otherwise, remap as a member, but create a new remap
                                else {
                                    $text = $this->remap[$id][$text] = $this->base52_encode($this->var_count);
                                    $this->var_count++;
                                }
                            }

                            # if this is not an object member, map it as a function
                            else {
                                if(isset($this->remap[$id][$text])){ $text = $this->remap[$id][$text]; }
                                else {
                                    $text = $this->remap[$id][$text] = $this->base52_encode($this->var_count);
                                    $this->var_count++;
                                }
                            }
                        }
                    }

                    /* @todo: eventually, it would be cool if this could minify
                     * associative array indeces */
                    /*
                    else if($id == T_CONSTANT_ENCAPSED_STRING){
                        $text = 'ARRAY_INDEX';
                    } 
                    */

                    # buffer the text
                    $buffer .= $text;
                }
            }
        }

        # now that the new source has been minified and buffered, strip out any 
        # unnecessary remaining whitespace
        if($this->options['remove_whitespace']){
            # allow no more than 1 space between tokens
            $buffer = preg_replace('/\s\s+/', ' ' , $buffer);
            # remove spaces surrounding tokenizing characters
            $buffer = preg_replace('/;\s/'  , ';' , $buffer);
            $buffer = preg_replace('/\{\s/' , '{' , $buffer);
            $buffer = preg_replace('/\s\}/' , '}' , $buffer);
            $buffer = preg_replace('/\(\s/' , '(' , $buffer);
            $buffer = preg_replace('/\s\)/' , ')' , $buffer);
        }

        # return the result
        return $buffer;
    }

    /**
     * Converts a number to base-52, which uses only letters for counting.
     *
     * @param int $n                   The number to convert to base-52
     * @return string $encoded         The base-52 encoded number
     */
    private function base52_encode($n){
        # buffer the encoded conversion string
        $encoded = '';
        while($n >= 52){
            $encoded .= 'Z';
            $n -= 52;
        }
        $encoded .= $this->b52_map[$n];

        # return the result
        return $encoded;
    }
}
