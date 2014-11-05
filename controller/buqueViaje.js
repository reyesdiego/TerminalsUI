/**
 * Created by Artiom on 05/11/2014.
 */

myapp.controller('buqueViajeCtrl', function($scope, invoiceFactory){
	$scope.ocultarFiltros = ['fechaDesde', 'fechaHasta', 'contenedor'];
	$scope.model = {
		'nroPtoVenta': '',
		'codTipoComprob': 0,
		'nroComprobante': '',
		'razonSocial': '',
		'documentoCliente': '',
		'fechaDesde': $scope.fechaDesde,
		'fechaHasta': $scope.fechaHasta,
		'contenedor': '',
		'buque': '',
		'estado': 'N',
		'codigo': '',
		'filtroOrden': 'gateTimestamp',
		'filtroOrdenAnterior': '',
		'filtroOrdenReverse': false,
		'order': ''
	};

	invoiceFactory.getShipTrips(function(data){
		console.log(data);
	})

});