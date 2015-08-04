/**
 * Created by artiom on 12/06/15.
 */

myapp.controller('queuedMailsCtrl', ['$scope', 'turnosFactory', 'loginService', function($scope, turnosFactory, loginService){
	$scope.control = true;
	$scope.currentPage = 1;
	$scope.itemsPerPage = 15;
	$scope.totalItems = 0;
	$scope.turnosGates = true;
	$scope.cargando = false;
	$scope.configPanel = {
		tipo: 'panel-info',
		titulo: 'Turnos',
		mensaje: 'No se han encontrado turnos para los filtros seleccionados.'
	};

	$scope.ocultarFiltros = ['fechaInicio', 'buque', 'viaje', 'mov'];

	// Fecha (dia y hora)
	$scope.model = {
		'nroPtoVenta': '',
		'codTipoComprob': 0,
		'nroComprobante': '',
		'razonSocial': '',
		'documentoCliente': '',
		'fechaInicio': '',
		'fechaFin': '',
		'fechaConGMT': true,
		'contenedor': '',
		'buqueNombre': '',
		'viaje': '',
		'estado': 'N',
		'code': '',
		'mov': '',
		'filtroOrden': 'gateTimestamp',
		'filtroOrdenAnterior': '',
		'filtroOrdenReverse': false,
		'order': ''
	};

	// Variable para almacenar la info principal que trae del factory
	$scope.turnos = [];

	$scope.$on('cambioPagina', function(event, data){
		$scope.currentPage = data;
		$scope.cargaTurnos();
	});

	$scope.$on('cambioFiltro', function(event, data){
		$scope.currentPage = 1;
		$scope.cargaTurnos();
	});

	$scope.$on('errorInesperado', function(e, mensaje){
		$scope.cargando = false;
		$scope.turnos = [];
		$scope.configPanel = mensaje;
	});

	// Carga los turnos por fechas
	$scope.cargaPorFiltros = function(){
		$scope.currentPage = 1;
		$scope.cargaTurnos();
	};

	$scope.cargaTurnos = function(){
		$scope.cargando = true;
		$scope.turnos = [];
		$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		$scope.page.limit = $scope.itemsPerPage;
		$scope.configPanel = {
			tipo: 'panel-info',
			titulo: 'Turnos',
			mensaje: 'No se han encontrado turnos para los filtros seleccionados.'
		};
		turnosFactory.getQueuedMails($scope.model, $scope.page, function(data){
			if (data.status === "OK"){
				$scope.turnos = data.data;
				$scope.totalItems = data.totalCount;
			} else {
				$scope.configPanel = {
					tipo: 'panel-danger',
					titulo: 'Turnos',
					mensaje: 'Se ha producido un error al cargar los turnos.'
				};
			}
			$scope.cargando = false;
		});
	};

	// Carga los turnos del día hasta la hora del usuario
	if (loginService.getStatus()) $scope.cargaTurnos();

	$scope.$on('terminoLogin', function(){
		$scope.cargaTurnos();
	});

	$scope.$on('cambioTerminal', function(){
		$scope.cargaTurnos();
	});

}]);
