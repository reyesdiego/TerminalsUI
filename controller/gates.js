/**
 * Created by leo on 31/03/14.
 */

myapp.controller('gatesCtrl', ['$scope', 'gatesFactory', 'loginService', function ($scope, gatesFactory, loginService) {
	$scope.totalItems = 0;
	$scope.turnosGates = true;
	//$scope.currentPage = 1;
	$scope.configPanel = {
		tipo: 'panel-info',
		titulo: 'Gates',
		mensaje: 'No se han encontrado gates para los filtros seleccionados.'
	};

	// Fecha (dia y hora)
	$scope.fechaInicio = new Date();
	$scope.fechaFin = new Date();
	$scope.fechaInicio.setHours(0, 0);
	$scope.fechaFin.setMinutes(0);

	// Variable para almacenar la info principal que trae del factory
	$scope.gates = {};
	$scope.detallesGates = false;

	$scope.filtrosGates = ['codTipoComprob', 'nroComprobante', 'razonSocial', 'fechaInicio', 'nroPtoVentaOrden', 'codTipoComprobOrden', 'nroComprobOrden', 'razonOrden', 'fechaOrden', 'importeOrden'];

	$scope.filtrosComprobantes = ['codTipoComprob', 'nroComprobante', 'fechaInicio', 'codigo', 'razonSocial', 'contenedor', 'nroPtoVentaOrden', 'codTipoComprobOrden', 'nroComprobOrden', 'razonOrden', 'fechaOrden', 'importeOrden'];

	$scope.model = {
		'nroPtoVenta': '',
		'codTipoComprob': 0,
		'nroComprobante': '',
		'razonSocial': '',
		'documentoCliente': '',
		'fechaInicio': $scope.fechaInicio,
		'fechaFin': $scope.fechaFin,
		'contenedor': '',
		'buqueNombre': '',
		'viaje': '',
		'estado': 'N',
		'code': '',
		'mov': '',
		'filtroOrden': 'gateTimestamp',
		'filtroOrdenAnterior': 'gateTimestamp',
		'filtroOrdenReverse': true,
		'order': '"gateTimestamp": -1',
		'fechaConGMT': true,
		'carga': '',
		'ontime': ''
	};

	$scope.page = {
		limit: 10,
		skip:0
	};

	$scope.itemsPerPage = 10;
	$scope.cargando = true;

	$scope.$on('cambioPagina', function(event, data){
		$scope.currentPage = data;
		$scope.cargaGates();
	});

	$scope.$on('cambioFiltro', function(event, data){
		$scope.currentPage = 1;
		$scope.cargaGates();
	});

	$scope.$on('errorInesperado', function(e, mensaje){
		$scope.cargando = false;
		$scope.gates = [];
		$scope.configPanel = mensaje;
	});

	$scope.cargaGates = function () {
		$scope.cargando = true;
		$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		$scope.configPanel = {
			tipo: 'panel-info',
			titulo: 'Gates',
			mensaje: 'No se han encontrado gates para los filtros seleccionados.'
		};
		gatesFactory.getGate($scope.model, $scope.page, function (data) {
			if (data.status === "OK") {
				$scope.gates = data.data;
				$scope.totalItems = data.totalCount;
			} else {
				$scope.configPanel = {
					tipo: 'panel-danger',
					titulo: 'Gates',
					mensaje: 'Se ha producido un error al cargar los gates.'
				};
			}
			$scope.cargando = false;
		});
	};

	if (loginService.getStatus()) $scope.cargaGates();

	$scope.$on('terminoLogin', function(){
		$scope.cargaGates();
	});

}]);
