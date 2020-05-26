<?php
//error_reporting(E_ERROR | E_PARSE);
ini_set('memory_limit', '-1');
ini_set('max_execution_time', 300);
set_time_limit(300);

define('APP_FOLDER_PATH', dirname(__FILE__) . '/../..');
include(APP_FOLDER_PATH . '/inc/init.php');
//function utf8ize($d) {
//    if (is_array($d)) {
//        foreach ($d as $k => $v) {
//            $d[$k] = utf8ize($v);
//        }
//    } else if (is_string ($d)) {
//        return utf8_encode($d);
//    }
//    return $d;
//}
//$trip_rows = GTFS::getTripsByMinute($_GET['hhmm'], $_GET['ymd']);
$trip_rows = GTFS::getSpecificTripsByMinute($_GET['hhmm'], $_GET['ymd'],$_GET['vtype']);
//print_r ($trip_rows[2][stops] );
//echo (json_encode(utf8ize($trip_rows[2][stops]) ));
//print_r($trip_rows);
JsonView::dump($trip_rows);