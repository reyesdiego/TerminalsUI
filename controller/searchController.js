/**
 * Created by artiom on 12/03/15.
 */

myapp.controller("searchController", ['$scope', 'generalCache', 'contenedoresCache', 'generalFunctions', 'invoiceFactory', 'turnosFactory', '$sce', 'dialogs', 'loginService', '$filter',
	function($scope, generalCache, contenedoresCache, generalFunctions, invoiceFactory, turnosFactory, $sce, dialogs, loginService, $filter){

		$scope.status = {
			open: true
		};
		//$scope.minDate = new Date(2015,0,1);
		//$scope.maxDate = new Date();
		$scope.maxDateD = new Date();
		$scope.maxDateH = $scope.maxDate + 1;
		$scope.dateOptions = {
			formatYear: 'yyyy',
			maxDate: new Date(),
			minDate: new Date(2015,0,1),
			startingDay: 1
		};
		$scope.listaBuques = generalCache.get('buques' + loginService.getFiltro());
		$scope.vouchers = generalCache.get('vouchers' + loginService.getFiltro());
		$scope.listaRazonSocial = generalCache.get('clientes' + loginService.getFiltro());
		$scope.listaTrenes = generalCache.get('trenes' + loginService.getFiltro());
		$scope.itemsPerPageData = [
			{ value: 10, description: '10 items por página', ticked: false},
			{ value: 15, description: '15 items por página', ticked: true},
			{ value: 20, description: '20 items por página', ticked: false},
			{ value: 50, description: '50 items por página', ticked: false}
		];
		$scope.estadosComprobantes = $filter('filter')(generalCache.get('estados'), $scope.filtroEstados);
		$scope.estadosComprobantes.forEach(function(unEstado){
			unEstado.ticked = false;
		});

		$scope.listaViajes = [];
		$scope.volverAPrincipal = true;

		$scope.active = {
			impo: true,
			expo: false
		};
		$scope.datepickerMode = 'month';

		$scope.$on('notificacionDetalle', function(event, data){
			var fechaAuxInicio, fechaAuxFin, fechaAux;
			if (data.filtro == 'fechaTurno'){
				fechaAuxInicio = new Date(data.contenido.inicio);
				fechaAuxFin = new Date(data.contenido.fin);
				$scope.model['fechaInicio'] = new Date(fechaAuxInicio.getFullYear(), fechaAuxInicio.getMonth(), fechaAuxInicio.getCDate(), fechaAuxInicio.getHours(), fechaAuxInicio.getMinutes());
				$scope.model['fechaFin'] = new Date(fechaAuxFin.getFullYear(), fechaAuxFin.getMonth(), fechaAuxFin.getDate(), fechaAuxFin.getHours(), fechaAuxFin.getMinutes());
				$scope.$emit('iniciarBusqueda', $scope.model);
			} else if(data.filtro == 'turno'){
				fechaAuxInicio = new Date(data.contenido.inicio);
				fechaAuxFin = new Date(data.contenido.fin);
				$scope.model['fechaInicio'] = new Date(fechaAuxInicio.getFullYear(), fechaAuxInicio.getMonth(), fechaAuxInicio.getDate(), fechaAuxInicio.getHours(), fechaAuxInicio.getMinutes());
				$scope.model['fechaFin'] = new Date(fechaAuxFin.getFullYear(), fechaAuxFin.getMonth(), fechaAuxFin.getDate(), fechaAuxFin.getHours(), fechaAuxFin.getMinutes());
				$scope.model['mov'] = data.contenido.mov;
				$scope.active = {
					impo: (data.contenido.mov == 'IMPO'),
					expo: (data.contenido.mov == 'EXPO')
				};
				$scope.model['buqueNombre'] = data.contenido.buque;
				$scope.model['contenedor'] = data.contenido.contenedor;
				$scope.$emit('iniciarBusqueda', $scope.model);
			} else if(data.filtro == 'gate'){
				fechaAux = new Date(data.contenido.fecha);
				$scope.model['fechaInicio'] = new Date(fechaAux.getFullYear(), fechaAux.getMonth(), fechaAux.getDate(), fechaAux.getHours(), fechaAux.getMinutes());
				$scope.model['fechaFin'] = new Date(fechaAux.getFullYear(), fechaAux.getMonth(), fechaAux.getDate(), fechaAux.getHours(), fechaAux.getMinutes() + 1);
				$scope.model['buqueNombre'] = data.contenido.buque;
				$scope.model['contenedor'] = data.contenido.contenedor;
				$scope.$emit('iniciarBusqueda', $scope.model);
			} else {
				$scope.filtrado(data.filtro, data.contenido);
			}
		});

		$scope.openDate = function(event){
			generalFunctions.openDate(event);
		};
		$scope.hitEnter = function(evt){
			if(angular.equals(evt.keyCode,13))
				$scope.$emit('iniciarBusqueda', 'hitEnter');
		};
		$scope.cambioItemsPorPagina = function(data){
			$scope.filtrado('itemsPerPage', data.value);
		};
		$scope.estadoSeleccionado = function(data){
			var contenido = '';
			if (data.ticked){
				$scope.estadosComprobantes.forEach(function(unEstado){
					if (unEstado.ticked){
						if (contenido == ''){
							contenido += unEstado._id;
						} else {
							contenido += ',' + unEstado._id;
						}
					}
				});
			} else {
				contenido = $scope.model.estado.replace(',' + data._id, '');
				contenido = contenido.replace(data._id + ',', '');
				contenido = contenido.replace(data._id, '');
				if (contenido == ''){
					contenido = 'N';
				}
			}
			$scope.filtrado('estado', contenido);
		};
		$scope.buqueSelected = function(selected){
			if (angular.isDefined(selected)){
				$scope.model.buqueNombre = selected.originalObject.buque;
				var i = 0;
				selected.originalObject.viajes.forEach(function(viaje){
					var objetoViaje = {
						'id': i,
						'viaje': viaje.viaje
					};
					$scope.listaViajes.push(objetoViaje);
					i++;
				});
				$scope.filtrado('buque', selected.title);
			}
		};

		$scope.viajeSelected = function(selected){
			if (angular.isDefined(selected)){
				$scope.model.viaje = selected.title;
				$scope.filtrado('viaje', selected.title);
			}
		};

		$scope.clientSelected = function(selected){
			if (angular.isDefined(selected) && selected.title != $scope.model.razonSocial){
				$scope.model.razonSocial = selected.title;
				$scope.filtrado('razonSocial', selected.title);
			}
		};

		$scope.trenSelected = function(selected){
			if (angular.isDefined(selected)){
				$scope.model.tren = selected.title;
				$scope.filtrado('tren', selected.title);
			}
		};

		$scope.definidoStatus = function(turno){
			return angular.isDefined(turno.email);
		};

		$scope.filtrado = function(filtro, contenido){
			if (filtro == 'fechaInicio' && contenido == 'liquidacion') contenido = $scope.minDate;
			if (filtro == 'fechaFin' && contenido == 'liquidacion') contenido = $scope.model.fechaInicio;

			if (filtro == 'fechaInicio' && contenido == 'turnos') {
				contenido = '';
				$scope.model.fechaFin = '';
			}
			$scope.model[filtro] = contenido;
			if (filtro == 'razonSocial') {
				$scope.model[filtro] = filtrarCaracteresInvalidos(contenido);
			}
			if (filtro == 'buqueNombre') {
				if (contenido != ''){
					var i = 0;
					$scope.listaBuques.forEach(function(buque){
						if (buque.buque == contenido){
							buque.viajes.forEach(function(viaje){
								var objetoViaje = {
									'id': i,
									'viaje': viaje.viaje
								};
								$scope.listaViajes.push(objetoViaje);
								i++;
							})
						}
					});
				} else {
					$scope.model.viaje = '';
				}
			}
			if ($scope.model.fechaInicio > $scope.model.fechaFin && $scope.model.fechaFin != ''){
				$scope.model.fechaFin = new Date($scope.model.fechaInicio);
				$scope.model.fechaFin.setDate($scope.model.fechaFin.getDate() + 1);
			}
			cargaPorFiltros();
		};

		var filtrarCaracteresInvalidos = function(palabra){
			if (angular.isDefined(palabra) && palabra.length > 0){
				var palabraFiltrada;
				var caracteresInvalidos = ['*', '(', ')', '+', ':', '?'];
				palabraFiltrada = palabra;
				for (var i = 0; i <= caracteresInvalidos.length - 1; i++){
					if (palabraFiltrada.indexOf(caracteresInvalidos[i], 0) > 0){
						palabraFiltrada = palabraFiltrada.substring(0, palabraFiltrada.indexOf(caracteresInvalidos[i], 0));
					}
				}
				return palabraFiltrada.toUpperCase();
			} else {
				return palabra;
			}
		};

		//FUNCIONES DE TABLE TURNOS /////////////////////////////////////////////////////////////////////
		$scope.mostrarHTML = false;

		$scope.comprobanteTurno = function(contenedor, idTurno){
			$scope.loadingState = true;
			turnosFactory.comprobanteTurno(contenedor, idTurno, function(data, status){
				if (status == 'OK'){
					$scope.respuesta = data;
					$scope.mostrarHTML = true;
				} else {
					dialogs.error('Consulta de turnos', 'Se ha producido un error al cargar los datos');
					$scope.mostrarResultado = true;
				}
				$scope.loadingState = false;
			});
		};

		$scope.ocultarTurno = function(){
			$scope.mostrarHTML = false;
		};

		$scope.to_trusted = function(htmlCode) {
			return $sce.trustAsHtml(htmlCode);
		};

		//FUNCIONES DE TABLE GATES //////////////////////////////////////////////////////////////////////
		$scope.noVoyEnTrenVoyEnCamion = function(trenOCamion){
			return angular.isDefined(trenOCamion) && trenOCamion != null && trenOCamion != "";
		};
		$scope.colorHorario = function (gate) {
			return generalFunctions.colorHorario(gate);
		};
		$scope.mostrarDetalle = function(contenedor){
			$scope.loadingState = true;
			$scope.paginaAnterior = $scope.currentPage;
			$scope.totalGates = $scope.totalItems;
			$scope.detallesGates = true;
			$scope.contenedor = contenedor.contenedor;
			var datos = { 'contenedor': contenedor.contenedor };
			invoiceFactory.getInvoice($scope.$id, datos, { skip: 0, limit: $scope.itemsPerPage }, function (data) {
				if (data.status === 'OK') {
					$scope.invoices = data.data;
					$scope.totalItems = data.totalCount;
				}
				$scope.loadingState = false;
			});
		};
		$scope.ocultarDetallesGates = function(){
			$scope.volverAPrincipal = !$scope.volverAPrincipal;
			$scope.detallesGates = false;
			$scope.totalItems = $scope.totalGates;
			$scope.currentPage = $scope.paginaAnterior
		};

		$scope.cambiarTipoMov = function(tipoMov){
			if ($scope.ocultarBusqueda || $scope.ocultarFiltros.indexOf('mov', 0) < 0){
				$scope.active = {
					impo: (tipoMov == 'IMPO'),
					expo: (tipoMov == 'EXPO')
				};
				$scope.model.mov = tipoMov;
				$scope.$emit('iniciarBusqueda');
			}
		};

		$scope.filtrarOrden = function(filtro){
			$scope.model = generalFunctions.filtrarOrden($scope.model, filtro);
			$scope.$emit('iniciarBusqueda');
		};
		///////////////////////////////////////////////////////////////////////////////////////////////////
		var cargaPorFiltros = function () {
			for (var elemento in $scope.model){
				if (!angular.isDefined($scope.model[elemento])) $scope.model[elemento] = '';
			}
			$scope.$broadcast('checkAutoComplete');
			$scope.$emit('iniciarBusqueda', $scope.model);
		};

		$scope.$on('cambioTerminal', function(){
			$scope.detallesGates = false;
			$scope.listaBuques = generalCache.get('buques' + loginService.getFiltro());
			$scope.listaRazonSocial = generalCache.get('clientes' + loginService.getFiltro());
			$scope.vouchers = generalCache.get('vouchers' + loginService.getFiltro());
			$scope.listaTrenes = generalCache.get('trenes' + loginService.getFiltro());
		});

	}]);