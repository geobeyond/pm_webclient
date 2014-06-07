<?php 

$fid=$_GET['fid'];
if ($_POST['fid']!='') $fid=$_POST['fid'];

$db=new PDO('mysql:host=localhost;dbname=ushahidi_v2','root','Divater100!');

$result = $db->query("SELECT name, path FROM phase1_img where fk_feature='{$fid}'");
$noResult=true;
foreach($result as $row) {
	$noResult=false;
	$media="";
	if (preg_match("!^images!", $row['path'])){
		$media['name']=$row['name'];
		$media['path']=$row['path'];
		$media['thumb']=str_replace("images/{$fid}", "images/{$fid}/thumbnail", $row['path']);
		$ret['images'][]=$media;
	}
	else {
		$media['name']=$row['name'];
		$media['path']=$row['path'];
		$ret['videos'][]=$media;
	}
}
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
die(json_encode($ret));



?>