<?php

header("Content-Type: text/plain");

$nick = (isset($_FILES['file_data'])) ? $_FILES['file_data'] : NULL;

if ($nick) {
    echo $nick;
} else {
    echo "FAIL";
}

?>