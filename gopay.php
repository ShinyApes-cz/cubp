<?php
require_once "https://raw.githubusercontent.com/gopaycommunity/gopay-php-api/master/autoload.php";

use GoPay\Payments;

$goid = 1234567890;
$clientId = "sandbox-client-id";
$clientSecret = "sandbox-client-secret";

$gopay = Payments::create([
    'goid' => $goid,
    'clientId' => $clientId,
    'clientSecret' => $clientSecret,
    'isProductionMode' => false
]);

// ===== Uložení registrace =====
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$address = $_POST['address'];
$role = $_POST['role'];

$regId = time();

// upload souborů
$uploaded = [];
if(!empty($_FILES['files'])){
  foreach($_FILES['files']['tmp_name'] as $i => $tmp){
    if($_FILES['files']['error'][$i] === 0){
      $ext = pathinfo($_FILES['files']['name'][$i], PATHINFO_EXTENSION);
      $nameFile = $regId."_".$i.".".$ext;
      move_uploaded_file($tmp, "uploads/".$nameFile);
      $uploaded[] = $nameFile;
    }
  }
}

// (tady můžeš uložit do DB)

// ===== GoPay platba =====
$response = $gopay->createPayment([
    'payer' => [
        'default_payment_instrument' => 'PAYMENT_CARD',
        'contact' => [
            'email' => $email,
            'phone_number' => $phone
        ]
    ],
    'amount' => 200000, // 2000 Kč v haléřích
    'currency' => 'CZK',
    'order_number' => $regId,
    'order_description' => 'CUBP – online registrace',
    'items' => [[
        'name' => 'Registrační poplatek',
        'amount' => 200000,
        'count' => 1
    ]],
    'callback' => [
        'return_url' => 'https://tvujweb.cz/thanks.html',
        'notification_url' => 'https://tvujweb.cz/notify.php'
    ]
]);

if(isset($response['gw_url'])){
    header("Location: ".$response['gw_url']);
    exit;
}else{
    echo "Chyba platby";
    print_r($response);
}
