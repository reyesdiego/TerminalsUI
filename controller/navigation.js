/**
 * Created by Artiom on 14/03/14.
 */
(function() {
	myapp.controller('navigationCtrl', function($scope, $rootScope, $state, invoiceFactory, loginService, authFactory, $injector) {

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

		if (loginService.getStatus()){
			$rootScope.esUsuario = loginService.getType();
			$rootScope.terminal = loginService.getInfo();
			$rootScope.grupo = loginService.getGroup();
			//Esta carga se realiza en el caso de haber actualizado la página
			invoiceFactory.getDescriptionItem(function(data){
				$rootScope.itemsDescriptionInvoices = data.data;
			});
			if (loginService.getType() == 'agp'){
				$rootScope.filtroTerminal = loginService.getFiltro();
			}

			// Carga el tema de la terminal
			$rootScope.switchTheme(loginService.getFiltro());
		} else {
			$rootScope.switchTheme('BACTSSA');
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
				$rootScope.filtroTerminal = terminal;
				$scope.irA();
				loginService.setFiltro(terminal);
				$rootScope.switchTheme(terminal);
				authFactory.setTheme(terminal);
			}
		};
	});

})();