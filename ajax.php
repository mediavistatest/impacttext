<?php
$ch = curl_init();
$url = "http://tlsionweb01.excel.com/mercury/cmp/$_GET[todo]";
curl_setopt($ch,CURLOPT_URL, $url);
$fields_string = '';
foreach($_POST as $key=>$value) {
	$fields_string .= $key.'='.$value.'&';
}
$fields_string = rtrim($fields_string, '&');

curl_setopt($ch,CURLOPT_POST, count($_POST));
curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
//error_log("URL: $url, Fields: $fields_string");
echo curl_exec($ch);
 
