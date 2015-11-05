<?php
/**
 * Created by PhpStorm.
 * User: artiom
 * Date: 25/06/15
 * Time: 10:10
 */

function get_post(){
	return json_decode(file_get_contents('php://input'), true);
};

function send_response($data){
	echo json_encode($data);
};

function crear_archivos_graficos($charts, $id){
	foreach ($charts as $chart) {
		$chart['image'] = substr($chart['image'], 1+strrpos($chart['image'], ','));
		$chart['image'] = base64_decode($chart['image']);

		file_put_contents(".temp/" . $chart['filename'] . $id . ".jpg", $chart['image']);
	}
};

function borrar_archivos_graficos($charts, $id){
	foreach ($charts as $chart) {
		unlink(".temp/" . $chart['filename'] . $id . ".jpg");
	}
};