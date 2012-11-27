<?php
$out = array();

/*
exec('pwd', $out);
echo join($out, "\n") . "\n";

exec('cd ..', $out);
echo join($out, "\n") . "\n";

exec('pwd', $out);
echo join($out, "\n") . "\n";
*/

/*
echo getcwd() . "\n";
chdir('..');
echo getcwd() . "\n";
exec('cd ..');
echo getcwd() . "\n";
`cd ..`;
echo getcwd() . "\n";
 */

echo `pwd`;
echo `cd ..`;
echo `pwd`;

echo `cd ..; pwd`;

