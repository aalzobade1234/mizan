<?php

// إعدادات
$dir = "videos/";
$base = "http://your-domain.com/videos/";

// إنشاء المجلد
if (!is_dir($dir)) {
    mkdir($dir, 0777, true);
}

// 🧹 تنظيف الملفات القديمة (أكثر من ساعة)
foreach (glob($dir . "*.time") as $file) {
    $id = basename($file, ".time");
    $time = file_get_contents($file);

    if (time() - $time > 3600) {
        @unlink($dir . $id . ".3gp");
        @unlink($file);
    }
}

// التحقق من الرابط
if (!isset($_GET['url'])) {
    die("استخدم: ?url=رابط_الفيديو");
}

$url = $_GET['url'];

// توليد اسم
$id = uniqid();
$mp4 = $dir . $id . ".mp4";
$gp3 = $dir . $id . ".3gp";

// تحميل الفيديو
$data = @file_get_contents($url);
if (!$data) {
    die("فشل تحميل الفيديو");
}

file_put_contents($mp4, $data);

// تحويل إلى 3GP
$cmd = "ffmpeg -i $mp4 -s 176x144 -r 12 -b:v 96k -acodec aac -ar 8000 -ac 1 $gp3 2>&1";
exec($cmd);

// حذف الملف الأصلي
unlink($mp4);

// حفظ الوقت
file_put_contents($dir . $id . ".time", time());

// إرجاع الرابط
echo $base . $id . ".3gp";

?>