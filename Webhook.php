<?php

$input = file_get_contents("php://input");

$data = json_decode($input, true);

if(!$data){

   exit("NO DATA");

}

$event = $data["event"];

if($event == "PAYMENT_RECEIVED" || $event == "PAYMENT_CONFIRMED"){

   $orderId = $data["payment"]["externalReference"];

   if(!$orderId){

      exit("NO ORDERID");

   }

   $secret = "7LqXTAUY2UlM8fHgABybRexjFktE1xvfSQMVJIal";

   $url = "https://newbank-de5f3-default-rtdb.firebaseio.com/orders/$orderId.json?auth=".$secret;

   $dados = json_encode([

      "payment" => "paid"

   ]);

   $ch = curl_init($url);

   curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PATCH");

   curl_setopt($ch, CURLOPT_POSTFIELDS, $dados);

   curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

   curl_setopt($ch, CURLOPT_HTTPHEADER, [

     "Content-Type: application/json"

   ]);

   curl_exec($ch);

   curl_close($ch);

   echo "OK";

}

?>
