<?php

$callbackName = $_REQUEST['jsonpcallback'];

$data = '{"anning" : "1", "again" : 2}';

echo $callbackName . '(' . $data . ')';
