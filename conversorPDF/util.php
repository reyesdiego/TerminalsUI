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