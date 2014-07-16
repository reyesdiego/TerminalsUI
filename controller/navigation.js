/**
 * Created by Artiom on 14/03/14.
 */

function navigationCtrl($scope, $rootScope, $state, invoiceFactory, loginService){
	"use strict";
	$rootScope.esUsuario = '';
	$rootScope.terminal = '';
	$scope.acceso = '';
	$rootScope.filtroTerminal = '';

	if (loginService.getStatus()){
		$rootScope.esUsuario = loginService.getType();
		$rootScope.terminal = loginService.getInfo();
		//Esta carga se realiza en el caso de haber actualizado la página
		invoiceFactory.getDescriptionItem(function(data){
			$rootScope.itemsDescriptionInvoices = data.data;
		});
		if (loginService.getType() == 'agp'){
			$rootScope.filtroTerminal = loginService.getFiltro();
		}

		// Carga el tema de la terminal
		if ($rootScope.terminal.terminal == 'BACTSSA' || $rootScope.terminal.terminal == 'TRP' || $rootScope.terminal.terminal == 'TERMINAL4'){
			$rootScope.switchTheme($rootScope.terminal.terminal)
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
		$rootScope.switchTheme('BACTSSA');
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
		loginService.setFiltro(terminal);
		$rootScope.switchTheme(terminal);
		$scope.irA();
	};

}
