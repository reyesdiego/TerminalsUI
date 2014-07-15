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
		//Esta carga se realiza en el caso de haber actualizado la página
		invoiceFactory.getDescriptionItem(function(data){
			$rootScope.itemsDescriptionInvoices = data.data;
		});
		if (loginService.getType() == 'agp'){
			$rootScope.filtroTerminal = loginService.getFiltro();
			$rootScope.estiloTerminal = loginService.getFiltro().toLowerCase();
		}
		// Carga el tema de la terminal
		if ($rootScope.terminal == 'bactssa'){
			$scope.switchTheme('cerulean')
		}
		if ($rootScope.terminal == 'trp'){
			$scope.switchTheme('flaty')
		}
		if ($rootScope.terminal == 'terminal4'){
			$scope.switchTheme('united')
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

	$scope.switchTheme = function(title){
		var i, a;
		for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
			if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
				a.disabled = a.getAttribute("title") != title;
			}
		}
	};
}
