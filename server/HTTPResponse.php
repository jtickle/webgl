<?php

require_once('Configuration.php');

class HTTPResponse
{
    protected $code;
    protected $status;
    protected $headers;
    protected $content;

    public function __construct($code)
    {
        $this->headers = array();

        $this->setCode($code);
    }

    public function setCode($code)
    {
        $status = Configuration::get('http', $code);
        if(is_null($status)) {
            throw new Exception("HTTP Status code $code is not defined in HTTPResponse");
        }
        
        $this->code   = $code;
        $this->status = $status;
    }

    public function setContent($content)
    {
        $this->content = $content;
    }

    public function show()
    {
        header("HTTP/1.1 $this->code $this->status");

        foreach($headers as $key => $val) {
            header("$key: $val");
        }

        echo $content;
    }
}

?>
