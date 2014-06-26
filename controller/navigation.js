/**
 * Created by Artiom on 14/03/14.
 */

function navigationCtrl($scope, $rootScope, $state, invoiceFactory, loginService){
	"use strict";
	$rootScope.esUsuario = '';
	$rootScope.terminal = '';
	$scope.acceso = '';

	if (loginService.getStatus()){
		$rootScope.esUsuario = loginService.getType();
		$rootScope.terminal = loginService.getInfo();
		// Se carga el array de la descripcion de los items de las facturas
		invoiceFactory.getDescriptionItem(loginService.getInfo.terminal, function(data){
			$rootScope.itemsDescriptionInvoices = data.data;
		});
	}

	$scope.$watch(function() {
		$scope.acceso = $rootScope.esUsuario;
		$scope.terminal = $rootScope.terminal;
	});

	$scope.salir = function(){
		$rootScope.esUsuario = '';
		$state.transitionTo('login');
		loginService.unsetLogin();
	};

	$scope.irA = function(){
		if (loginService.getStatus()){
			$state.transitionTo('tarifario');
		} else{
			$state.transitionTo('login');
		}
	}

}
