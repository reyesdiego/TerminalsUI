/**
 * Created by artiom on 12/03/15.
 */

myapp.controller("searchController", ['$scope', 'generalCache', 'contenedoresCache', 'generalFunctions', 'invoiceFactory', 'turnosFactory', '$sce', 'dialogs', 'loginService',
	function($scope, generalCache, contenedoresCache, generalFunctions, invoiceFactory, turnosFactory, $sce, dialogs, loginService){
		$scope.status = {
			open: true
		};
		$scope.maxDate = new Date();
		$scope.listaBuques = generalCache.get('buques' + loginService.getFiltro());
		$scope.vouchers = generalCache.get('vouchers' + loginService.getFiltro());
		$scope.listaViajes = [];
		$scope.volverAPrincipal = true;

		$scope.$on('notificacionDetalle', function(event, data){
			var fechaAuxInicio, fechaAuxFin, fechaAux;
			if (data.filtro == 'fechaTurno'){
				fechaAuxInicio = new Date(data.contenido.inicio);
				fechaAuxFin = new Date(data.contenido.fin);
				$scope.model['fechaInicio'] = new Date(fechaAuxInicio.getUTCFullYear(), fechaAuxInicio.getUTCMonth(), fechaAuxInicio.getUTCDate(), fechaAuxInicio.getUTCHours(), fechaAuxInicio.getUTCMinutes());
				$scope.model['fechaFin'] = new Date(fechaAuxFin.getUTCFullYear(), fechaAuxFin.getUTCMonth(), fechaAuxFin.getUTCDate(), fechaAuxFin.getUTCHours(), fechaAuxFin.getUTCMinutes());
				$scope.$emit('cambioFiltro', $scope.model);
			} else if(data.filtro == 'turno'){
				fechaAuxInicio = new Date(data.contenido.inicio);
				fechaAuxFin = new Date(data.contenido.fin);
				$scope.model['fechaInicio'] = new Date(fechaAuxInicio.getUTCFullYear(), fechaAuxInicio.getUTCMonth(), fechaAuxInicio.getUTCDate(), fechaAuxInicio.getUTCHours(), fechaAuxInicio.getUTCMinutes());
				$scope.model['fechaFin'] = new Date(fechaAuxFin.getUTCFullYear(), fechaAuxFin.getUTCMonth(), fechaAuxFin.getUTCDate(), fechaAuxFin.getUTCHours(), fechaAuxFin.getUTCMinutes());
				$scope.model['mov'] = data.contenido.mov;
				$scope.model['buqueNombre'] = data.contenido.buque;
				$scope.model['contenedor'] = data.contenido.contenedor;
				$scope.$emit('cambioFiltro', $scope.model);
			} else if(data.filtro == 'gate'){
				fechaAux = new Date(data.contenido.fecha);
				$scope.model['fechaInicio'] = new Date(fechaAux.getUTCFullYear(), fechaAux.getUTCMonth(), fechaAux.getUTCDate(), fechaAux.getUTCHours(), fechaAux.getUTCMinutes());
				$scope.model['fechaFin'] = new Date(fechaAux.getUTCFullYear(), fechaAux.getUTCMonth(), fechaAux.getUTCDate(), fechaAux.getUTCHours(), fechaAux.getUTCMinutes() + 1);
				$scope.model['buqueNombre'] = data.contenido.buque;
				$scope.model['contenedor'] = data.contenido.contenedor;
				$scope.$emit('cambioFiltro', $scope.model);
			} else {
				$scope.filtrado(data.filtro, data.contenido);
			}
		});

		$scope.openDate = function(event){
			generalFunctions.openDate(event);
		};
		$scope.hitEnter = function(evt){
			if(angular.equals(evt.keyCode,13))
				$scope.$emit('cambioFiltro', 'hitEnter');
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
			}
		};

		$scope.viajeSelected = function(selected){
			if (angular.isDefined(selected)){
				$scope.model.viaje = selected.title;
				$scope.filtrado('viaje', selected.title);
			}
		};

		$scope.definidoStatus = function(turno){
			return angular.isDefined(turno.email);
		};

		$scope.filtrado = function(filtro, contenido){
			$scope.model[filtro] = contenido;
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
			$scope.cargaPorFiltros();
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
			return angular.isDefined(trenOCamion);
		};
		$scope.colorHorario = function (gate) {
			return generalFunctions.colorHorario(gate);
		};
		$scope.mostrarDetalle = function(contenedor){
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
				$scope.model.mov = tipoMov;
				$scope.$emit('cambioFiltro');
			}
		};

		$scope.filtrarOrden = function(filtro){
			$scope.model = generalFunctions.filtrarOrden($scope.model, filtro);
			$scope.$emit('cambioFiltro', 'lalalal');
		};
		///////////////////////////////////////////////////////////////////////////////////////////////////
		$scope.cargaPorFiltros = function () {
			for (var elemento in $scope.model){
				if (!angular.isDefined($scope.model[elemento])) $scope.model[elemento] = '';
			}
			$scope.$broadcast('checkAutoComplete');
			$scope.$emit('cambioFiltro', $scope.model);
		};

		$scope.$on('cambioTerminal', function(){
			$scope.listaBuques = generalCache.get('buques' + loginService.getFiltro());
			$scope.vouchers = generalCache.get('vouchers' + loginService.getFiltro());
		});

		$scope.$on('$destroy', function(){
			invoiceFactory.cancelRequest();
		});

	}]);