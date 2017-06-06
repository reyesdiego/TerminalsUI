/**
 * Created by Artiom on 14/03/14.
 */

myapp.controller('navigationCtrl', ['$scope', '$rootScope', '$state', 'loginService', 'authFactory', 'generalFunctions', '$timeout', 'notify', '$filter',
	function($scope, $rootScope, $state, loginService, authFactory, generalFunctions, $timeout, notify, $filter) {

		$scope.isCollapsed = true;

		notify.config({
			duration: 20000,
			position: 'left',
			maximumOpen: 4
		});

		$scope.colaNotificaciones = [];
		$scope.notificacionesMaximasPantalla = 4;
		$scope.iniciarChequeo = true;

		$scope.dataTerminal = loginService;

		$scope.cerrarMenu = function(){
			if (!$scope.isCollapsed) $scope.isCollapsed = true;
		};

		$scope.irA = function(){
			if (loginService.isLoggedIn){
				$state.reload();
			} else {
				$state.transitionTo('login');
			}
		};

		$scope.switchMoneda = function(){
			if ($rootScope.moneda == 'PES'){
				$rootScope.moneda = 'DOL';
			} else if ($rootScope.moneda == 'DOL'){
				$rootScope.moneda = 'PES';
			}
		};

		$scope.setearTerminal = function(terminal){
			if (loginService.filterTerminal != terminal){
				loginService.filterTerminal = terminal;
				$state.reload();
			}
		};

		$scope.tieneAcceso = function(aguja){
			return generalFunctions.in_array(aguja, loginService.acceso);
		};

		$scope.imprimirVista = function(){
			window.print();
		};

		function chequearNotificaciones(){
			$timeout(() => {
				if ($scope.colaNotificaciones.length > 0){
					let ponerNotificaciones = $scope.colaNotificaciones.length;
					if (ponerNotificaciones > $scope.notificacionesMaximasPantalla) ponerNotificaciones = $scope.notificacionesMaximasPantalla;
					for (let i = 0; i < ponerNotificaciones; i++){
						const template = $scope.colaNotificaciones[i];
						notify({
							messageTemplate: template.messageTemplate,
							title: template.title,
							classes: template.clase,
							onClose: $scope.liberarNotificacion,
							scope: $scope
						});
						$scope.notificacionesMaximasPantalla--;
					}
					$scope.colaNotificaciones.splice(0, ponerNotificaciones);
				}
				if ($scope.colaNotificaciones.length > 0){
					chequearNotificaciones();
				} else {
					$scope.iniciarChequeo = true;
				}
			}, 21000)
		}

		function procesarNotificacion(ruta, template, titulo, terminal){
			const clase = 'cg-notify-' + terminal;
			if ($state.current.name != ruta){
				switch (ruta){
					case 'turnos':
						$rootScope.appointmentNotify++;
						break;
					case 'gates':
						$rootScope.gateNotify++;
						break;
					case 'invoices':
						$rootScope.invoiceNotify++;
				}
			} else if($rootScope.verNotificaciones) {
				if ($scope.notificacionesMaximasPantalla > 0){
					notify({
						messageTemplate: template,
						title: titulo,
						classes: clase,
						onClose: $scope.liberarNotificacion,
						scope: $scope
					});
					$scope.notificacionesMaximasPantalla--;
				} else {
					const notificacion = {
						messageTemplate: template,
						title: titulo,
						clase: clase
					};
					$scope.colaNotificaciones.push(notificacion);
					if ($scope.iniciarChequeo){
						$scope.iniciarChequeo = false;
						chequearNotificaciones();
					}
				}
			}
		}

		$scope.$on('socket:appointment', (ev, data) => {
			if (loginService.isLoggedIn){
				if (data.status === 'OK') {
					const turno = data.data;
					let nuevoTurnoTemplate;
					if (turno.terminal == loginService.filterTerminal){
						nuevoTurnoTemplate = `<span><strong>Tipo:</strong> <a href ng-click="notificacionDetalle('mov', '${turno.mov}')">${turno.mov}</a> - <strong>Fecha:</strong> <a href ng-click="notificacionDetalle('fechaTurno', {inicio:'${turno.inicio}', fin:'${turno.fin}'})">${$filter('date')(turno.inicio,'dd/MM/yyyy','-0300' )}</a>
												<br>De ${$filter('date')(turno.inicio, 'HH:mm', '-0300')} a ${$filter('date')(turno.fin, 'HH:mm', '-0300')}
												<br><strong>Buque:</strong> <a href ng-click="notificacionDetalle('buqueNombre', '${turno.buque}')">${turno.buque}</a> - <strong>Viaje:</strong> ${turno.viaje} 
												<br><strong>Contenedor:</strong> <a href ng-click="notificacionDetalle('contenedor','${turno.contenedor}')">${turno.contenedor}</a>
												<br><a href ng-click="notificacionDetalle('turno', {inicio:'${turno.inicio}', fin: '${turno.fin}', mov: '${turno.mov}', buque: '${turno.buque}', contenedor: '${turno.contenedor}'})">Ver turno</a></span>`;
					} else {
						nuevoTurnoTemplate = `<span><a href ng-click="setearTerminal('${turno.terminal}')">
													<strong>Tipo:</strong> ${turno.mov} - <strong>Fecha:</strong> ${$filter('date')(turno.inicio,'dd/MM/yyyy','-0300' )}
													<br>De ${$filter('date')(turno.inicio, 'HH:mm', '-0300')} a ${$filter('date')(turno.fin, 'HH:mm', '-0300')}
													<br><strong>Buque:</strong> ${turno.buque} - <strong>Viaje:</strong> ${turno.viaje}
													<br><strong>Contenedor:</strong> ${turno.contenedor}
												</a></span>`;
					}
					if (loginService.type == 'agp'){
						procesarNotificacion('turnos', nuevoTurnoTemplate, 'Nuevo Turno ' + turno.terminal, turno.terminal);
					} else if (turno.terminal == loginService.filterTerminal){
						procesarNotificacion('turnos', nuevoTurnoTemplate, 'Nuevo Turno', turno.terminal);
					}
				}
			}
		});

		$scope.$on('socket:gate', (ev, data) => {
			if (loginService.isLoggedIn){
				if (data.status === 'OK') {
					const gate = data.data;
					let nuevoGateTemplate;
					if (gate.terminal == loginService.filterTerminal){
						if (gate.mov != 'PASO'){
							nuevoGateTemplate = `<span><strong>Tipo: </strong>${gate.mov} - <strong>Fecha: </strong>${$filter('date')(gate.gateTimestamp, 'dd/MM/yyyy HH:mm', '-0300')}
													<br><strong>Buque: </strong><a href ng-click="notificacionDetalle('buqueNombre', '${gate.buque}')">${gate.buque}</a> - <strong>Viaje: </strong>${gate.viaje}
													<br><strong>Contenedor: </strong><a href ng-click="notificacionDetalle('contenedor', '${gate.contenedor}')">${gate.contenedor}</a>
													<br><a href ng-click="notificacionDetalle('gate', {fecha: '${gate.gateTimestamp}', buque: '${gate.buque}', contenedor: '${gate.contenedor}'})">Ver gate</a>
												</span>`;
						} else {
							nuevoGateTemplate = `<span>
													<strong>Tipo: </strong>${gate.mov} - <strong>Fecha: </strong>${$filter('date')(gate.gateTimestamp, 'dd/MM/yyyy HH:mm', '-0300')}
												</span>`;
						}
					} else {
						if (gate.mov != 'PASO'){
							nuevoGateTemplate = `<span><a href ng-click="setearTerminal('${gate.terminal}')">
													<strong>Tipo: </strong>${gate.mov} - <strong>Fecha: </strong>${$filter('date')(gate.gateTimestamp, 'dd/MM/yyyy HH:mm', '-0300')}
													<br><strong>Buque: </strong>${gate.buque} - <strong>Viaje: </strong>${gate.viaje}
													<br><strong>Contenedor: </strong>${gate.contenedor}
												</a></span>`;
						} else {
							nuevoGateTemplate = `<span><a href ng-click="setearTerminal('${gate.terminal}')">
													<strong>Tipo: </strong>${gate.mov} - <strong>Fecha: </strong>${$filter('date')(gate.gateTimestamp, 'dd/MM/yyyy HH:mm', '-0300')}
												</a></span>`;
						}
					}
					if (loginService.type == 'agp'){
						procesarNotificacion('gates', nuevoGateTemplate, 'Nuevo Gate ' + gate.terminal, gate.terminal);
					} else if (gate.terminal == loginService.filterTerminal){
						procesarNotificacion('gates', nuevoGateTemplate, 'Nuevo Gate', gate.terminal);
					}
				}
			}
		});

		$scope.$on('socket:invoice', (ev, data) => {
			if (loginService.isLoggedIn){
				if (loginService.type == 'agp' || (loginService.type == 'terminal' && loginService.filterTerminal == data.data.terminal)){
					const comprobante = data.data;
					let nuevoComprobanteTemplate;
					if (comprobante.terminal == loginService.filterTerminal){
						nuevoComprobanteTemplate = `<span>Tipo: ${$filter('nombreComprobante')(comprobante.codTipoComprob, false)} - Número: ${comprobante.nroComprob}
														<br>Razón social: ${comprobante.razon}
														<br>Emisión: ${$filter('date')(comprobante.emision, 'dd/MM/yyyy', 'UTC')}
														<br><a href ng-click="mostrarComprobante('${comprobante._id}', '${comprobante.nroComprob}')">Ver comprobante</a>
													</span>`;
					} else {
						nuevoComprobanteTemplate = `<span><a href ng-click="setearTerminal('${comprobante.terminal}')">
														Tipo: ${$filter('nombreComprobante')(comprobante.codTipoComprob, false)} - Número: ${comprobante.nroComprob}
														<br>Razón social: ${comprobante.razon}
														<br>Emisión: ${$filter('date')(comprobante.emision, 'dd/MM/yyyy', 'UTC')}
													</a></span>`;
					}
					if (loginService.type == 'agp'){
						procesarNotificacion('invoices', nuevoComprobanteTemplate, 'Nuevo Comprobante ' + comprobante.terminal, comprobante.terminal);
					} else if (comprobante.terminal == loginService.filterTerminal){
						procesarNotificacion('invoices', nuevoComprobanteTemplate, 'Nuevo Comprobante', comprobante.terminal);
					}
				}
			}
		});

		$scope.$on('$stateChangeStart', (event, toState) => {
			notify.closeAll();
			if ($scope.colaNotificaciones.length > 0){
				switch ($state.current.name){
					case 'turnos':
						$scope.appointmentNotify = $scope.colaNotificaciones.length;
						break;
					case 'gates':
						$scope.gateNotify = $scope.colaNotificaciones.length;
						break;
					case 'invoices':
						$scope.invoiceNotify = $scope.colaNotificaciones.length;
						break;
				}
				$scope.colaNotificaciones = [];
			}
			switch (toState.name){
				case 'invoices':
					$rootScope.invoiceNotify = 0;
					break;
				case 'gates':
					$rootScope.gateNotify = 0;
					break;
				case 'turnos':
					$rootScope.appointmentNotify = 0;
					break;
			}
		});

		$scope.mostrarComprobante = function(comprobanteId, numeroComprobante){
			const comprobante = {
				_id: comprobanteId,
				nroComprob: numeroComprobante
			};
			$rootScope.$broadcast('mostrarComprobante', comprobante);
		};

		$scope.notificacionDetalle = function(filtro, contenido){
			const data = {
				filtro: filtro,
				contenido: contenido
			};
			$rootScope.$broadcast('notificacionDetalle', data);
		};

		$scope.liberarNotificacion = function(){
			$scope.notificacionesMaximasPantalla++
		};

		$scope.onOffNotificaciones = function(){
			$rootScope.verNotificaciones = !$rootScope.verNotificaciones;
			$scope.colaNotificaciones = [];
			if (!$rootScope.verNotificaciones) notify.closeAll();
		};

	}]);
