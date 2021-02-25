<?

function extract_email($extract_email){
	if(stripos($extract_email, '<') != false){
		preg_match("/^[^<]+<([^>]+)>/iu", $extract_email, $matches);
		if(isset($matches[1]) && filter_var($matches[1], FILTER_VALIDATE_EMAIL)){
			$extract_email = $matches[1];
		}else{
			global $email;
			send_mail($email, 'Не удалось извлечь e-mail адрес || CS:GO Primer', "Не удалось извлечь e-mail адрес из строки: <b>{$extract_email}</b>.<br>Файл: <b>". __FILE__ ."</b>, cтрока: ". __LINE__ ."", $email);
			
			exit('Не правильный e-mail адрес!');
		}
	}
	return $extract_email;
}

function send_mail($to, $subject, $body, $from, $raw_html = false){
	$body = $raw_html ? $body : <<<END
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>{$subject}</title>
	<style>
		#outlook a {padding:0;}
		body{width:100%!important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0;font-family:Tahoma, Geneva, sans-serif;}
		img {outline:none; text-decoration:none; -ms-interpolation-mode: bicubic;}
		a img {border:none;}
		p {margin: 1em 0;}
	</style>
</head>
<body style="font-family:Arial, Geneva, Helvetica, sans-serif!important;padding: 0; margin: 0;" alink="#132b70" link="#132b70" text="#030606">
{$body}
</body>
</html>
END;
	
	$subject = "=?utf-8?B?".base64_encode($subject)."?=";

	$headers = "MIME-Version: 1.0\r\n".
				"Content-type: text/html; charset=utf-8\r\n".
				"From: {$from}\r\n".
				"Reply-To: {$from}\r\n".
				"Return-Path: {$from}\r\n".
				"X-Mailer: PHP/".phpversion();

	preg_match('/([-0-9a-z_\.]+@[-0-9a-z_\.]+\.[a-z]{2,6})/isu', $from, $email);
	if(!isset($email[1])){
		exit("Не удалось извлечь e-mail адрес из строки: {$from}");
	}

	return mail($to, $subject, $body, $headers, "-f{$email[1]}");
	//return mail($to, $subject, $body, $headers);
}
