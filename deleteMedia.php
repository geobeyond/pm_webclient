<?php 
$db=new PDO('mysql:host=sql.geovolution.it;dbname=geovolut37572','geovolut37572','jack76');

if (isset($_GET['id'])){
	$sql="delete from phase1_img where idphase1_img={$_GET['id']}";
}else {
	$sql="delete from  phase1_img where fk_feature='{$_GET['fid']}'";
}
$stmt=$db->prepare($sql);
$db->beginTransaction();
$stmt->execute();
$db->commit();
?>