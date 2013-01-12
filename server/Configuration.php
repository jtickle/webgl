<?php

class Configuration
{
    private static $INSTANCE;

    public static function initialize($inifile)
    {
        if(!is_null(self::$INSTANCE)) {
            throw new Exception('Configuration has already been initialized.');
        }

        if(!file_exists($inifile)) {
            throw new Exception("Configuration file $inifile does not exist or cannot be read.");
        }

        self::$INSTANCE = new Configuration(parse_ini_file($inifile, true));
    }

    public static function getInstance()
    {
        if(is_null(self::$INSTANCE)) {
            throw new Exception('Configuration has not been initialized.');
        }

        return self::$INSTANCE;
    }

    public static function get($section, $key)
    {
        return self::getInstance()->getConfig($section, $key);
    }

    protected $config;

    private function __construct(array $config)
    {
        $this->config = $config;
    }

    public function getConfig($section, $key)
    {
        if(isset($this->config[$section])) {
            if(isset($this->config[$section][$key])) {
                return $this->config[$section][$key];
            }
        }

        return null;
    }
}

?>
