/**
 * Created by Artiom on 14/03/14.
 */

function navigationCtrl($scope, $rootScope, $state, invoiceFactory, loginService){
	"use strict";
	$rootScope.esUsuario = '';
	$rootScope.terminal = '';
	$scope.acceso = '';
	$rootScope.filtroTerminal = '';
	$rootScope.estiloTerminal = '';

	if (loginService.getStatus()){
		$rootScope.esUsuario = loginService.getType();
		$rootScope.terminal = loginService.getInfo();
		// Se carga el array de la descripcion de los items de las facturas
		invoiceFactory.getDescriptionItem(loginService.getFiltro(), function(data){
			$rootScope.itemsDescriptionInvoices = data.data;
		});
		if (loginService.getType() == 'agp'){
			$rootScope.filtroTerminal = loginService.getFiltro();
			$rootScope.estiloTerminal = loginService.getFiltro().toLowerCase();
		}
	}

	$scope.$watch(function() {
		$scope.acceso = $rootScope.esUsuario;
		$scope.terminal = $rootScope.terminal;
	});

	$scope.salir = function(){
		$rootScope.esUsuario = '';
		$state.transitionTo('login');
		loginService.unsetLogin();
		$rootScope.filtroTerminal = '';
		$rootScope.estiloTerminal = '';
	};

	$scope.irA = function(){
		if (loginService.getStatus()){
			$state.transitionTo($state.current.name);
			window.location.reload();
		} else{
			$state.transitionTo('login');
		}
	};

	$scope.setearTerminal = function(terminal){
		$rootScope.filtroTerminal = terminal;
		$rootScope.estiloTerminal = terminal.toLowerCase();
		loginService.setFiltro(terminal);
	};
}
