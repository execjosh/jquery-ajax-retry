<?php
$http_code = (isset($_GET['http_code'])) ? $_GET['http_code'] : '404 Not Found';
header("HTTP/1.1 {$http_code}");
print_r($_GET);
?>
