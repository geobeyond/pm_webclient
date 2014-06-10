<?php 
$url=$_GET['url'];
$ret=file_get_contents($url);
header ("Content-Type:text/xml");
die($ret);

?>