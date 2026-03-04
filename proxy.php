<?php
if(!isset($_GET['q'])) exit;

$q = urlencode($_GET['q']);
$url = "https://s60tube.io.vn/search?q=".$q;

$html = file_get_contents($url);

preg_match_all('/video\/([a-zA-Z0-9_-]+)/', $html, $ids);
preg_match_all('/bottom:2px">([^<]+)/', $html, $titles);

echo "<ul>";

for($i=0;$i<count($ids[1]);$i++){
    $id = $ids[1][$i];
    $title = isset($titles[1][$i]) ? $titles[1][$i] : "بدون عنوان";
    echo "<li>
    <a href='http://s60tube.io.vn/videoplayback?v=".$id."'>
    ".$title."
    </a></li>";
}

echo "</ul>";
?>