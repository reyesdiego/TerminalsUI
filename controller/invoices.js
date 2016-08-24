/**
 * Created by Diego Reyes on 2/3/14.
 */

myapp.controller('invoicesCtrl', ['$rootScope', '$scope', 'invoiceFactory', 'invoiceManager', function($rootScope, $scope, invoiceFactory, invoiceManager){

	$scope.fechaInicio = new Date();
	$scope.fechaFin = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

	$scope.ocultarFiltros = ['nroPtoVenta'];

	$scope.model = {
		'nroPtoVenta': '',
		'codTipoComprob': '',
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
		'filtroOrden': 'fecha.emision',
		'filtroOrdenAnterior': '',
		'filtroOrdenReverse': false,
		'order': '',
		'itemsPerPage': 15,
		'rates': '',
		'payment': '',
		'payed': ''
	};

	$scope.invoices = [];

	$scope.cargando = true;

	$scope.$on('cambioPagina', function(event, data){
		$scope.currentPage = data;
		$scope.cargaDatos();
	});

	$scope.$on('cambioFiltro', function(event, data){
		$scope.currentPage = 1;
		$scope.cargaDatos();
	});

	$scope.$on('cambioOrden', function(event, data){
		$scope.cargaDatos();
	});

	$scope.$on('errorInesperado', function(e, mensaje){
		$scope.cargando = false;
		$scope.invoices = [];
		$scope.mensajeResultado = mensaje;
	});

	$scope.cargaDatos = function(){
		$scope.cargando = true;
		$scope.page.skip = (($scope.currentPage - 1) * $scope.model.itemsPerPage);
		$scope.page.limit = $scope.model.itemsPerPage;
		$scope.invoices = [];
		invoiceManager.getInvoices($scope.$id, $scope.model, $scope.page, function(data){
			if(data.status === 'OK'){
				$scope.invoices = data.data;
				$scope.totalItems = data.totalCount;
				$scope.cargando = false;
			} else {
				$scope.mensajeResultado = {
					titulo: 'Error',
					mensaje: 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.',
					tipo: 'panel-danger'
				};
				$scope.invoices = [];
				$scope.cargando = false;
			}
		});
	};

	/*$scope.$on('cambioTerminal', function(){
		$scope.cargando = true;
	});*/

	/*$scope.$on('$destroy', function(){
		console.log('DESTRUIR');
		invoiceFactory.cancelRequest();
	});*/

}]);