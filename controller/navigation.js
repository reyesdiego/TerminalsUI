/**
 * Created by Artiom on 14/03/14.
 */

myapp.controller('navigationCtrl', ['$scope', '$rootScope', '$state', 'loginService', 'socket', 'authFactory', 'cacheFactory', 'generalFunctions', '$timeout', 'notify', '$filter', 'invoiceFactory', function($scope, $rootScope, $state, loginService, socket, authFactory, cacheFactory, generalFunctions, $timeout, notify, $filter, invoiceFactory) {

	"use strict";

	notify.config({
		duration: 20000,
		position: 'left',
		maximumOpen: 4
	});

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
						var nuevoTurnoTemplate = '<span><strong>Tipo:</strong> ' + turno.mov + " Fecha: " + $filter('date')(turno.inicio,'dd/MM/yyyy','UTC' ) + "<br>De " + $filter('date')(turno.inicio, 'HH:mm', 'UTC') + " a " + $filter('date')(turno.fin, 'HH:mm', 'UTC') + "<br><strong>Buque:</strong> " + turno.buque + " - <strong>Viaje:</strong> " + turno.viaje + "<br><strong>Contenedor:</strong> " + turno.contenedor + '</span>';
						notify({
							messageTemplate: nuevoTurnoTemplate,
							title: 'Nuevo Turno',
							scope: $scope});
					}
				}
			}
		}
	});

	socket.on('gate', function (data) {
		console.log(data);
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
						//Notification.info({message: "Nuevo gate", title: "Nuevo gate", delay: 20000, _positionY: 'bottom', _positionX: 'left'});
					}
				}
			}
		}
	});

	socket.on('invoice', function (data) {
		if (loginService.getStatus()){
			var comprobante = data.data;
			if (comprobante.terminal == loginService.getFiltro()){
				if ($state.current.name != 'invoices'){
					$scope.invoiceNotify++;
					$scope.invoiceAnimar = 'agrandar';
					$timeout(function(){
						$scope.invoiceAnimar = '';
					}, 1000);
					$scope.$apply();
				} else {
					var nuevoComprobanteTemplate = '<span>Para ver el comprobante ingresado, haga click <a href ng-click="mostrarComprobante(\'' + comprobante._id + '\')">aquí</a></span>';
					notify({
						messageTemplate: nuevoComprobanteTemplate,
						title: 'Nuevo comprobante',
						scope: $scope});
					/*invoiceFactory.getInvoiceById(comprobante._id, function(data){
						comprobante = data;
						var nuevoComprobanteTemplate = '<span><strong>Nuevo Comprobante</strong><hr>'+
							'Para ver el comprobante ingresado, haga click <a href ng-click="mostrarComprobante(' + comprobante._id + ')">aquí</a></span>';
						//Notification.info({message: 'Tipo: ' + $filter('nombreComprobante')(comprobante.codTipoComprob) + ' - Número: ' + comprobante.nroComprob + '<br>Razón social: ' + comprobante.razon + '<br>Emisión: ' + $filter('date')(comprobante.fecha.emision, 'dd/MM/yyyy', 'UTC') + '<br>Importe: ' + $filter('formatCurrency')($rootScope.moneda) + ' ' + $filter('currency')($filter('conversionMoneda')(comprobante.importe.total, comprobante)), title: "Nuevo comprobante", delay: 20000, _positionY: 'bottom', _positionX: 'left'});

					});*/
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

	$scope.mostrarComprobante = function(comprobanteId){
		var comprobante={_id: comprobanteId};
		$rootScope.$broadcast('mostrarComprobante', comprobante);
	}

}]);
