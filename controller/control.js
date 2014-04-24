/**
 * Created by kolesnikov-a on 21/02/14.
 */

function controlCtrl($scope, controlPanelFactory){
	'use strict';

	var fecha = new Date();

	controlPanelFactory.getByDay(fecha, function(data){
		$scope.control = data[0];
		$scope.fecha = fecha;
	});
}