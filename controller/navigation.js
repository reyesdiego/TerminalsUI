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
						var nuevoTurnoTemplate = '<span><strong>Tipo:</strong> <a href ng-click="notificacionDetalle(\'mov\', \'' + turno.mov + "')\">" + turno.mov + " - <strong>Fecha:</strong> <a href ng-click=\"notificacionDetalle('fechaTurno', {inicio:'" + turno.inicio + "', fin:'" + turno.fin + "'})\">" + $filter('date')(turno.inicio,'dd/MM/yyyy','UTC' ) + "</a><br>De " + $filter('date')(turno.inicio, 'HH:mm', 'UTC') + " a " + $filter('date')(turno.fin, 'HH:mm', 'UTC') + "<br><strong>Buque:</strong> <a href ng-click=\"notificacionDetalle('buqueNombre', '" + turno.buque + "')\">" + turno.buque + "</a> - <strong>Viaje:</strong> " + turno.viaje + "<br><strong>Contenedor:</strong> <a href ng-click=\"notificacionDetalle('contenedor','" + turno.contenedor + "')\">" + turno.contenedor + '</a><br><a href ng-click="notificacionDetalle(\'turno\', {inicio:\'' + turno.inicio + '\', fin: \'' + turno.fin + '\', mov: \'' + turno.mov + '\', buque: \'' + turno.buque + '\', contenedor: \'' + turno.contenedor + '\'})">Ver turno</a></span>';
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
						var nuevoGateTemplate = '<span><strong>Tipo: </strong>' + gate.tipo + ' - <strong>Fecha: </strong>' + $filter('date')(gate.timestamp, 'dd/MM/yyyy HH:mm', 'UTC') + '<br><strong>Buque: </strong><a href ng-click="notificacionDetalle(\'buqueNombre\', \'' + gate.buque + '\')">' + gate.buque + '</a> - <strong>Viaje: </strong>' + gate.viaje + '<br><strong>Contenedor: </strong><a href ng-click="notificacionDetalle(\'contenedor\', \'' + gate.contenedor + '\')">' + gate.contenedor + '</a><br><a href ng-click="notificacionDetalle(\'gate\', {fecha: \'' + gate.gateTimeStamp + '\', buque: \'' + gate.buque + '\', contenedor: \'' + gate.contenedor + '\'})">Ver gate</a>';
						notify({
							messageTemplate: nuevoGateTemplate,
							title: 'Nuevo Gate',
							scope: $scope
						});
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
					invoiceFactory.getInvoiceById(comprobante._id, function(data){
						comprobante = data;
						var nuevoComprobanteTemplate = '<span>Tipo: ' + $filter('nombreComprobante')(comprobante.codTipoComprob) + ' - Número: ' + comprobante.nroComprob + '<br>Razón social: ' + comprobante.razon + '<br>Emisión: ' + $filter('date')(comprobante.fecha.emision, 'dd/MM/yyyy', 'UTC') + '<br>Importe: ' + $filter('formatCurrency')($rootScope.moneda) + ' ' + $filter('currency')($filter('conversionMoneda')(comprobante.importe.total, comprobante)) + '<br>Para ver el detalle del comprobante ingresado, haga click <a href ng-click="mostrarComprobante(\'' + comprobante._id + '\')">aquí</a></span>';
						notify({
							messageTemplate: nuevoComprobanteTemplate,
							title: 'Nuevo comprobante',
							scope: $scope});
					});
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
	};

	$scope.notificacionDetalle = function(filtro, contenido){
		var data = {
			filtro: filtro,
			contenido: contenido
		};
		$rootScope.$broadcast('notificacionDetalle', data);
	}

}]);
