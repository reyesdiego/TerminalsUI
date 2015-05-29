/**
 * Created by Artiom on 14/03/14.
 */

myapp.controller('navigationCtrl', ['$scope', '$rootScope', '$state', 'loginService', 'socket', 'authFactory', 'cacheFactory', 'generalFunctions', '$timeout', 'Notification', '$filter', function($scope, $rootScope, $state, loginService, socket, authFactory, cacheFactory, generalFunctions, $timeout, Notification, $filter) {

	"use strict";
	$rootScope.esUsuario = '';
	$rootScope.terminal = '';
	$scope.acceso = '';
	$scope.grupo = '';
	$rootScope.filtroTerminal = '';

	$scope.appointmentNotify = 0;
	$scope.invoiceNotify = 0;
	$scope.gateNotify = 0;

	$scope.appointmentAnimar = '';
	$scope.invoiceAnimar = '';
	$scope.gateAnimar = '';

	$scope.salir = function(){
		authFactory.logout();
		$rootScope.esUsuario = '';
		$state.transitionTo('login');
		$rootScope.filtroTerminal = '';
	};

	$scope.irA = function(){
		if (!$rootScope.cargandoCache) {
			if (loginService.getStatus()){
				$state.transitionTo($state.current.name);
				window.location.reload();
			} else {
				$state.transitionTo('login');
			}
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

	$scope.in_array = function(aguja, pajar){
		return in_array(aguja, pajar);
	};

	$scope.imprimirVista = function(){
		window.print();
	};

	socket.on('appointment', function (data) {
		console.log(data);
		if (loginService.getStatus()){
			if (data.status === 'OK') {
				var turno = data.data;
				if (turno.terminal == loginService.getFiltro()){
					if ($state.current.name != 'turnos'){
						$scope.appointmentNotify++;
						$scope.appointmentAnimar = 'agrandar';
						$timeout(function(){
							$scope.appointmentAnimar = '';
						}, 1000);
						$scope.$apply();
					} else {
						Notification.info({message: "<strong>Tipo:</strong> " + turno.mov + " Fecha: " + $filter('date')(turno.inicio,'dd/MM/yyyy','UTC' ) + "<br>De " + $filter('date')(turno.inicio, 'HH:mm', 'UTC') + " a " + $filter('date')(turno.fin, 'HH:mm', 'UTC') + "<br><strong>Buque:</strong> " + turno.buque + " - <strong>Viaje:</strong> " + turno.viaje + "<br><strong>Contenedor:</strong> " + turno.contenedor, title: "Nuevo turno", delay: 20000, _positionY: 'bottom', _positionX: 'left'});
					}
				}
			}
		}
	});

	socket.on('gate', function (data) {
		if (loginService.getStatus()){
			if (data.status === 'OK') {
				var gate = data.data;
				if (gate.terminal == loginService.getFiltro()){
					if ($state.current.name != 'gates'){
						$scope.gateNotify++;
						$scope.gateAnimar = 'agrandar';
						$timeout(function(){
							$scope.gateAnimar = '';
						}, 1000);
						$scope.$apply();
					} else {
						Notification.info({message: "Nuevo gate", title: "Nuevo gate", delay: 20000, _positionY: 'bottom', _positionX: 'left'});
					}
				}
			}
		}
	});

	socket.on('invoice', function (data) {
		if (loginService.getStatus()){
			var comprobante = data.data;
			console.log(comprobante);
			if (comprobante.terminal == loginService.getFiltro()){
				if ($state.current.name != 'invoices'){
					$scope.invoiceNotify++;
					$scope.invoiceAnimar = 'agrandar';
					$timeout(function(){
						$scope.invoiceAnimar = '';
					}, 1000);
					$scope.$apply();
				} else {
					Notification.info({message: 'Para ver el comprobante haga click <a href ng-click="verComprobante(' + comprobante._id + ')">aquí</a>', title: "Nuevo comprobante", delay: 20000, _positionY: 'bottom', _positionX: 'left'});
				}
			}
		}
	});

	$scope.$on('$stateChangeStart', function(event, toState){
		switch (toState.name){
			case 'invoices':
				$scope.invoiceNotify = 0;
				break;
			case 'gates':
				$scope.gateNotify = 0;
				break;
			case 'turnos':
				$scope.appointmentNotify = 0;
				break;
		}
	});

}]);
