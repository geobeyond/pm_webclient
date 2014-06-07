<?php
$sid=session_id();
if ($sid=="") {
	session_start();
	$sid=session_id();
}

//$file_db = new PDO('sqlite:users.db');
$file_db=new PDO('mysql:host=localhost;dbname=ushahidi-v2','root','Divater100!');
$loginPage=file_get_contents("loginPage.html");
if (isset($_POST['username']) && isset($_POST['password'])){
	$username=$_POST['username'];
	$password=$_POST['password'];
	$hashKey=uniqid("placemaker-".$sid);
	$result = $file_db->query("SELECT * FROM users where username='{$username}'");
	$noResult=true;
	foreach($result as $row) {
		$noResult=false;
	}
	if (!$noResult){
		if ($row['password']==$password){
			$update = "UPDATE users SET hashkey = '{$hashKey}'
			WHERE username='{$username}'";
			$file_db->exec($update);
			setcookie("hashKey",$hashKey);
			setcookie("username",$username);
			header("location: index.php");
		}else {
			$loginPage=str_replace("<!--message-->", "<span class=\"warning\" style=\"color:red\">Username/password error</span>", $loginPage);
			die($loginPage);
		}
	}else {
		$loginPage=str_replace("<!--message-->", "<span class=\"warning\" style=\"color:red\">Username not found</span>", $loginPage);
		die($loginPage);
	}
	
}

if (!isset($_COOKIE['hashKey'])){
	die($loginPage);
}else {
	$result = $file_db->query("SELECT * FROM users where username='{$_COOKIE['username']}'");
	$noResult=true;
	foreach($result as $row) {
		$noResult=false;
	}
	if (!$noResult){
		if ($row['hashkey']==$_COOKIE['hashKey']){
			$index=file_get_contents("indexTemplate");
			$prefix=$_COOKIE['username']."-".$sid."-";
			$script="<script>var prefix='{$prefix}';</script>";
			$index=str_replace("<!--script-->", $script, $index);
			die($index);
		}else {
			$loginPage=str_replace("<!--message-->", "<span class=\"warning\" style=\"color:red\">Authentication error</span>", $loginPage);
			die($loginPage);
		}
	}else {
		$loginPage=str_replace("<!--message-->", "<span class=\"warning\" style=\"color:red\">Authentication error</span>", $loginPage);
		die($loginPage);
	}
	
}

?>
