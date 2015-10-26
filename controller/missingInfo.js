/**
 * Created by artiom on 12/03/15.
 */
myapp.controller('missingInfo', ['$rootScope', '$scope', 'gatesFactory', 'loginService', 'dialogs', 'generalFunctions', 'turnosFactory', '$filter',
	function($rootScope, $scope, gatesFactory, loginService, dialogs, generalFunctions, turnosFactory, $filter){
		$scope.currentPage = 1;

		$scope.filteredDatos = [];

		$scope.datosFaltantes = [];
		$scope.cargando = false;

		$scope.hayError = false;

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

		$scope.model = {
			fechaInicio: new Date(),
			fechaFin: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
			itemsPerPage: 15,
			search: ''
		};

		$scope.model.fechaInicio.setHours(0, 0, 0, 0);
		$scope.model.fechaFin.setHours(0, 0, 0, 0);

		$scope.ocultarFiltros = ['nroPtoVenta', 'nroComprobante', 'codTipoComprob', 'nroPtoVenta', 'documentoCliente', 'contenedor', 'codigo', 'razonSocial', 'estado', 'buque', 'viaje', 'btnBuscar', 'rates'];

		$scope.$on('iniciarBusqueda', function(event, data){
			if ($scope.model.fechaInicio > $scope.model.fechaFin && $scope.model.fechaFin != ''){
				$scope.model.fechaFin = new Date($scope.model.fechaInicio);
				$scope.model.fechaFin.setDate($scope.model.fechaFin.getDate() + 1);
			}
			if ($scope.datoFaltante == 'gatesAppointments'){
				cargaDatos();
			}
		});

		$scope.recargar = function(){
			cargaDatos();
		};

		var cargaDatos = function(){
			switch ($scope.datoFaltante){
				case 'gates':
					$scope.cargando = true;
					gatesFactory.getMissingGates(function(data){
						if (data.status == 'OK'){
							$scope.hayError = false;
							$scope.datosFaltantes = data.data;
							$scope.totalItems = $scope.datosFaltantes.length;
							$scope.datosFaltantes.forEach(function(comprob){
								comprob.fecha = comprob.f;
							});
							$scope.configPanel = {
								tipo: 'panel-success',
								titulo: 'Control gates',
								mensaje: 'No se encontraron comprobantes con gates faltantes para los filtros seleccionados.'
							};
							filtrarPorFecha();
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
				case 'invoices':
					$scope.cargando = true;
					gatesFactory.getMissingInvoices(function(data){
						if (data.status == 'OK'){
							$scope.hayError = false;
							$scope.datosFaltantes = data.data;
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
				case 'appointments':
					$scope.cargando = true;
					turnosFactory.getMissingAppointments(function(data){
						if (data.status == 'OK'){
							$scope.hayError = false;
							$scope.datosFaltantes = data.data;
							$scope.totalItems = $scope.datosFaltantes.length;
							$scope.datosFaltantes.forEach(function(comprob){
								comprob.fecha = comprob.f;
							});
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
				case 'gatesAppointments':
					$scope.cargando = true;
					gatesFactory.gatesSinTurnos($scope.model, function(data){
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

		$scope.$watch('[model.fechaInicio, model.fechaFin]', function(){
			if ($scope.model.fechaInicio > $scope.model.fechaFin){
				$scope.model.fechaFin = new Date($scope.model.fechaInicio);
				$scope.model.fechaFin.setDate($scope.model.fechaFin.getDate() + 1);
			}
			if ($scope.datoFaltante == 'gatesAppointments'){
				$scope.mostrarDetalle = false;
				cargaDatos();
			} else {
				filtrarPorFecha();
			}
		});

		var filtrarPorFecha = function(){
			$scope.filteredDatos = $filter('dateRange')($scope.datosFaltantes, $scope.model.fechaInicio, $scope.model.fechaFin)
		};

		$scope.filtrarContenedores = function(){
			$scope.filteredDatos = $filter('filter')($scope.datosFaltantes, $scope.model.search);
		};

		$scope.detalleContenedor = function(contenedor){
			$scope.mostrarDetalle = true;
			$scope.$broadcast('detalleContenedor', contenedor);
		};

		if (loginService.getStatus()) cargaDatos();

		$scope.$on('terminoLogin', function(){
			$scope.acceso = $rootScope.esUsuario;
			cargaDatos();
		});

		$scope.$on('cambioTerminal', function(){
			cargaDatos();
		});

	}]);