<?php
// proxy.php
header('Content-Type: application/json; charset=utf-8');

if (isset($_GET['url'])) {
    $url = $_GET['url'];
    
    // استخدام cURL لجلب البيانات من الموقع المشفر SSL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // لتجاوز قيود الشهادات
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    echo $response;
} else {
    echo '{"error": "No URL provided"}';
}
?>
