<?

if(!isset($_POST['do']) || $_POST['do']!=='feedback'){
	exit;
}

function special_chars($data){
	return htmlspecialchars($data, ENT_QUOTES, "UTF-8", false);
}

$name = special_chars($_POST['name']);
$contacts = special_chars($_POST['contacts']);
$message = special_chars($_POST['message']);

$mess = "<p><b>Ім'я:</b> {$name}</p>";
$mess .= "<p><b>Контактні дані:</b> {$contacts}</p>";
$mess .= "<p><b>Повідомлення:</b> {$message}</p>";

include_once __DIR__ . '/send_mail.php';

send_mail('support@broccolidev.ru', "Зворотній зв'язок UCC", $mess, 'no-reply@ucc.designe.in.ua');