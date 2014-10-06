/**
 * Created by artiom on 23/09/14.
 */

function correlatividadCtrl($scope, invoiceFactory){

	$scope.hasta = new Date();
	$scope.desde = new Date($scope.hasta.getFullYear(), $scope.hasta.getMonth());

	$scope.loadingCorrelatividad = false;

	$scope.model = {
		'nroPtoVenta': '',
		'codTipoComprob': 0,
		'fechaDesde': $scope.desde,
		'fechaHasta': $scope.hasta
	};

	$scope.pantalla = {
		"tituloCorrelativo":  "Correlatividad",
		"mensajeCorrelativo": "Seleccione punto de venta y tipo de comprobante para realizar la búsqueda",
		"cartelCorrelativo": "panel-info",
		"resultadoCorrelativo": []
	};

	$scope.$on('cambioFiltro', function(event, data){
		$scope.model = data;
		$scope.controlCorrelatividad();
	});

	$scope.controlCorrelatividad = function(){
		$scope.loadingCorrelatividad = true;
		invoiceFactory.getCorrelative($scope.model, function(dataComprob) {
			$scope.result = dataComprob;
			if ($scope.result.totalCount > 0){
				$scope.pantalla.mensajeCorrelativo = "Se hallaron comprobantes faltantes: ";
				$scope.pantalla.cartelCorrelativo = "panel-danger";
				$scope.pantalla.tituloCorrelativo = "Error";
				$scope.pantalla.resultadoCorrelativo = $scope.result.data;
			} else {
				$scope.pantalla.tituloCorrelativo =  "Éxito";
				$scope.pantalla.mensajeCorrelativo = "No se hallaron comprobantes faltantes";
				$scope.pantalla.cartelCorrelativo = "panel-success";
				$scope.pantalla.resultadoCorrelativo = [];
			}
			$scope.loadingCorrelatividad = false;
		});
	};

}