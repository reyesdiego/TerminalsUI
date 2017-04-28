/**
 * Created by artiom on 12/03/15.
 */
myapp.controller('missingInfo', ['$rootScope', '$scope', 'gatesFactory', 'loginService', 'dialogs', 'generalFunctions', 'turnosFactory', '$filter', 'containerFactory', 'Container',
	function($rootScope, $scope, gatesFactory, loginService, dialogs, generalFunctions, turnosFactory, $filter, containerFactory, Container){

		if ($scope.savedState != null){
			$scope.currentPage = $scope.savedState.currentPage;
			$scope.datosFaltantes = $scope.savedState.datosFaltantes;
			$scope.totalItems = $scope.savedState.totalItems;
			$scope.model = $scope.savedState.model;
			$scope.hayError = $scope.savedState.hayError;
		} else {
			$scope.currentPage = 1;
			$scope.datosFaltantes = [];
			$scope.hayError = false;
			$scope.model = {
				fechaInicio: new Date(),
				fechaFin: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
				itemsPerPage: 15,
				search: ''
			};

			$scope.model.fechaInicio.setHours(0, 0, 0, 0);
			$scope.model.fechaFin.setHours(0, 0, 0, 0);
			$scope.totalItems = 0;
		}

		$scope.filteredDatos = [];
		$scope.cargando = false;

		$scope.$on('errorInesperado', function(e, mensaje){
			$scope.cargando = false;
			$scope.datosFaltantes = [];
			$scope.configPanel = mensaje;
		});

		$scope.colorHorario = function (gate) {
			return generalFunctions.colorHorario(gate);
		};

		$scope.cambioItemsPorPagina = function(data){
			$scope.filtrado('itemsPerPage', data.value);
		};

		$scope.configPanel = {
			tipo: 'panel-success',
			titulo: 'Control gates',
			mensaje: 'No se encontraron comprobantes con gates faltantes para los filtros seleccionados.'
		};

		$scope.ocultarFiltros = ['nroPtoVenta', 'nroComprobante', 'codTipoComprob', 'nroPtoVenta', 'documentoCliente', 'contenedor', 'codigo', 'razonSocial', 'estado', 'buque', 'viaje', 'rates'];

		$scope.$on('cambioPagina', function(event, data){
			$scope.currentPage = data;
			cargaDatos();
		});

		$scope.$on('iniciarBusqueda', function(event, data){
			if ($scope.model.fechaInicio > $scope.model.fechaFin && $scope.model.fechaFin != ''){
				$scope.model.fechaFin = new Date($scope.model.fechaInicio);
				$scope.model.fechaFin.setDate($scope.model.fechaFin.getDate() + 1);
			}
			cargaDatos();
			/*if ($scope.datoFaltante == 'gatesAppointments'){
				cargaDatos();
			}*/
		});

		$scope.recargar = function(){
			cargaDatos();
		};

		var cargaDatos = function(){
			$scope.mostrarDetalle = false;
			var page = {
				skip: ($scope.currentPage - 1) * $scope.model.itemsPerPage,
				limit: $scope.model.itemsPerPage
			};
			switch ($scope.datoFaltante){
				//Facturaciones sin gates
				case 'gates':
					$scope.cargando = true;
					containerFactory.getMissingGates($scope.model, page, function(data){
						if (data.status == 'OK'){
							$scope.hayError = false;
							$scope.datosFaltantes = data.data;
							$scope.totalItems = data.totalCount;
							/*$scope.datosFaltantes.forEach(function(comprob){
								comprob.fecha = comprob.f;
							});*/
							$scope.configPanel = {
								tipo: 'panel-success',
								titulo: 'Control gates',
								mensaje: 'No se encontraron comprobantes con gates faltantes para los filtros seleccionados.'
							};
							//filtrarPorFecha();
						} else {
							$scope.hayError = true;
							$scope.configPanel = {
								tipo: 'panel-danger',
								titulo: 'Control gates',
								mensaje: 'Se ha producido un error al cargar los gates faltantes.'
							};
						}
						$scope.cargando = false;
					});
					break;
				//Gates sin facturaciones
				case 'invoices':
					$scope.cargando = true;
					gatesFactory.getMissingInvoices($scope.model, page, function(data){
						if (data.status == 'OK'){
							$scope.hayError = false;
							$scope.datosFaltantes = data.data;
							$scope.datosFaltantes.forEach(function(registro){
								registro.contenedor = new Container({contenedor: registro.contenedor, ship: registro.buque, trip: registro.viaje});
							});
							$scope.totalItems = $scope.datosFaltantes.length;
							$scope.cargando = false;
							$scope.datosFaltantes.forEach(function(registro){
								registro.fecha = registro.gateTimestamp;
							});
							$scope.configPanel = {
								tipo: 'panel-success',
								titulo: 'Control gates',
								mensaje: 'No se encontraron gates con comprobantes faltantes.'
							};
							filtrarPorFecha();
						} else {
							$scope.hayError = true;
							$scope.configPanel = {
								tipo: 'panel-danger',
								titulo: 'Control gates',
								mensaje: 'Se ha producido un error al cargar los comprobantes faltantes.'
							};
						}
						$scope.cargando = false;
					});
					break;
				//Facturaciones sin turnos
				case 'appointments':
					$scope.cargando = true;
					containerFactory.getMissingAppointments($scope.model, function(data){
						if (data.status == 'OK'){
							$scope.hayError = false;
							$scope.datosFaltantes = data.data.slice(0, 10);
							$scope.totalItems = $scope.datosFaltantes.length;
							$scope.configPanel = {
								tipo: 'panel-success',
								titulo: 'Control gates',
								mensaje: 'No se encontraron comprobantes con turnos faltantes para los filtros seleccionados.'
							};
						} else {
							$scope.hayError = true;
							$scope.configPanel = {
								tipo: 'panel-danger',
								titulo: 'Control gates',
								mensaje: 'Se ha producido un error al cargar los turnos faltantes.'
							};
						}
						$scope.cargando = false;
					});
					break;
				//Gates sin turnos
				case 'gatesAppointments':
					$scope.cargando = true;
					containerFactory.gatesSinTurnos($scope.model, function(data){
						if (data.status == 'OK'){
							$scope.hayError = false;
							$scope.datosFaltantes = data.data;
							$scope.totalItems = $scope.datosFaltantes.length;
							$scope.filteredDatos = data.data;
						} else {
							$scope.hayError = true;
							$scope.configPanel = {
								tipo: 'panel-danger',
								titulo: 'Control gates',
								mensaje: 'Se ha producido un error al cargar los turnos faltantes.'
							};
							$scope.datosFaltantes = [];
							$scope.totalItems = 0;
							$scope.filteredDatos = [];
						}
						$scope.cargando = false;
					});
					break;
			}
		};

		/*$scope.$watch('[model.fechaInicio, model.fechaFin]', function(){
			if ($scope.model.fechaInicio > $scope.model.fechaFin){
				$scope.model.fechaFin = new Date($scope.model.fechaInicio);
				$scope.model.fechaFin.setDate($scope.model.fechaFin.getDate() + 1);
			}
			$scope.currentPage = 1;
			$scope.mostrarDetalle = false;
			cargaDatos();
			/*if ($scope.datoFaltante == 'gatesAppointments'){
				$scope.mostrarDetalle = false;
				cargaDatos();
			} else {
				filtrarPorFecha();
			}
		});*/

		var filtrarPorFecha = function(){
			$scope.filteredDatos = $filter('dateRange')($scope.datosFaltantes, $scope.model.fechaInicio, $scope.model.fechaFin);
		};

		$scope.filtrarContenedores = function(){
			$scope.filteredDatos = $filter('filter')($scope.datosFaltantes, $scope.model.search);
		};

		$scope.detalleContenedor = function(contenedor){
			$scope.mostrarDetalle = true;
			$scope.contenedorElegido = contenedor.contenedor;
			$scope.$broadcast('detalleContenedor', contenedor);
		};

		if (loginService.isLoggedIn && $scope.savedState == null) cargaDatos();

		/*$scope.$on('cambioTerminal', function(){
			cargaDatos();
		});*/

		$scope.$on('$destroy', function(){
			if ($scope.totalItems > 0){
				var modelSave = {
					currentPage: $scope.currentPage,
					datosFaltantes: $scope.datosFaltantes,
					totalItems: $scope.totalItems,
					model: $scope.model,
					hayError: $scope.hayError
				};

				$scope.$emit('saveState', $scope.datoFaltante, modelSave);
			}
		})

	}]);