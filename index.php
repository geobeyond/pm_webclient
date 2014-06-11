<?php

define('SYSPATH', '/var/www/ushahidi-v2/system/'); //cambia il path..

require('../ushahidi-v2/application/config/auth.php');


$sid=session_id();
if ($sid=="") {
	session_start();
	$sid=session_id();
}

//funzione da usare per trovare il salt  di una pwd
function find_salt($password, $salt_pattern)
        {
                $salt = '';

                foreach ($salt_pattern as $i => $offset)
                {
                        // Find salt characters, take a good long look...
                        $salt .= substr($password, $offset + $i, 1);
                }
                return $salt;
        }



//crea hash password
function hash_password($password, $salt, $salt_pattern)
{
        $hash = hash('sha1', $salt.$password);

                // Change salt to an array
                $salt = str_split($salt, 1);

                // Returned password
                $password = '';

                // Used to calculate the length of splits
                $last_offset = 0;

                foreach ($salt_pattern as $offset)
                {
                        // Split a new part of the hash off
                        $part = substr($hash, 0, $offset - $last_offset);

                        // Cut the current part out of the hash
                        $hash = substr($hash, $offset - $last_offset);

                        // Add the part to the password, appending the salt character
                        $password .= $part.array_shift($salt);

                        // Set the last offset to the current offset
                        $last_offset = $offset;
                }

                // Return the password, with the remaining hash appended
                return $password.$hash;
}



//$file_db = new PDO('sqlite:users.db');
$file_db=new PDO('mysql:host=localhost;dbname=ushahidi_v2','root','lynxbinario');
$loginPage=file_get_contents("loginPage.html");
if (isset($_POST['username']) && isset($_POST['password'])){
	$username=$_POST['username'];
	//$password=md5($_POST['password']);
	$password = $_POST['password'];
	$hashKey=uniqid("placemaker-".$sid);
	$result = $file_db->query("SELECT * FROM users where username='{$username}'");
	$noResult=true;
	foreach($result as $row) {
		$noResult=false;
	}
	if (!$noResult){
		
		//trova il salt
		$savedPassword=$row['password'];
		$salt_pattern=explode(',', $config['salt_pattern']);
		$salt = find_salt($savedPassword, $salt_pattern);
                
		//crea password con il salt trovato
		$hash_pwd = hash_password($password, $salt, $salt_pattern);

//		if ($row['password']==$password){
		if ($savedPassword === $hash_pwd)
		{
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
