<?php

require_once('HTTPResponse.php');
require_once('Configuration.php');

Configuration::initialize('config.ini.php');

$pdo = new PDO('mysql:dbname=walkabout;host=127.0.0.1', 'walkabout', 'w41k4b0u7');

$server = new PropertyServer($pdo);

$response = new HTTPResponse('405 Method Not Allowed');

$response->show();

switch($_SERVER['REQUEST_METHOD']) {
}

?>
