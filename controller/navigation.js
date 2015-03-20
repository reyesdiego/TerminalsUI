/**
 * Created by Artiom on 14/03/14.
 */

myapp.controller('navigationCtrl', ['$scope', '$rootScope', '$state', 'loginService', 'authFactory', 'cacheFactory', 'generalFunctions', function($scope, $rootScope, $state, loginService, authFactory, cacheFactory, generalFunctions) {

	"use strict";
	$rootScope.esUsuario = '';
	$rootScope.terminal = '';
	$scope.acceso = '';
	$scope.grupo = '';
	$rootScope.filtroTerminal = '';

	$scope.salir = function(){
		authFactory.logout();
		$rootScope.esUsuario = '';
		$state.transitionTo('login');
		loginService.unsetLogin();
		$rootScope.filtroTerminal = '';
		generalFunctions.switchTheme('BACTSSA');
	};

	$scope.irA = function(){
		if (loginService.getStatus()){
			$state.transitionTo($state.current.name);
			window.location.reload();
		} else{
			$state.transitionTo('login');
		}
	};

	if (loginService.getStatus()){
		$rootScope.esUsuario = loginService.getType();
		$rootScope.terminal = loginService.getInfo();
		$rootScope.grupo = loginService.getGroup();
		//Esta carga se realiza en el caso de haber actualizado la página
		if (loginService.getType() == 'agp'){
			$rootScope.filtroTerminal = loginService.getFiltro();
		}

		// Carga el tema de la terminal
		generalFunctions.switchTheme(loginService.getFiltro());
	} else {
		generalFunctions.switchTheme('BACTSSA');
	}

	$scope.$watch(function(){
		$scope.acceso = $rootScope.esUsuario;
		$scope.terminal = $rootScope.terminal;
		$scope.grupo = $rootScope.grupo;
	});

	$scope.switchMoneda = function(){
		if ($rootScope.moneda == 'PES'){
			$rootScope.moneda = 'DOL';
		} else if ($rootScope.moneda == 'DOL'){
			$rootScope.moneda = 'PES';
		}
	};

	$scope.setearTerminal = function(terminal){
		if ($rootScope.filtroTerminal != terminal){
			$rootScope.cambioTerminal = true;
			cacheFactory.limpiarCacheTerminal();
			$rootScope.filtroTerminal = terminal;
			loginService.setFiltro(terminal);
			generalFunctions.switchTheme(terminal);
			authFactory.setTheme(terminal);
			$state.transitionTo('cambioTerminal');
		}
	};
}]);
