/**
 * Created by artiom on 23/09/14.
 */

function correlatividadCtrl($rootScope, $scope, invoiceFactory){

	$scope.hasta = new Date();
	$scope.desde = new Date($scope.hasta.getFullYear(), $scope.hasta.getMonth());

	$scope.loadingCorrelatividad = false;

	$scope.model = {
		'nroPtoVenta': '',
		'codTipoComprob': 0,
		'fechaDesde': $scope.desde,
		'fechaHasta': $scope.hasta
	};

	$rootScope.modeloImpresion.vista = 'hidden-print';
	$rootScope.modeloImpresion.comprobante = 'hidden-print';
	$rootScope.modeloImpresion.correlativo = 'visible-print-block';
	$rootScope.modeloImpresion.report = 'hidden-print';

	$scope.pantalla = {
		"titulo":  "Correlatividad",
		"mensajeCorrelativo": "Seleccione punto de venta y tipo de comprobante para realizar la búsqueda",
		"tipo": "panel-info",
		"resultadoCorrelativo": []
	};

	$scope.$on('cambioFiltro', function(event, data){
		$scope.model = data;
		$scope.controlCorrelatividad();
	});

	$scope.$on('errorCorrelatividad', function(){
		$scope.pantalla.titulo =  "Error";
		$scope.pantalla.mensajeCorrelativo = 'Se produjo un error al cargar los datos. Inténtelo nuevamente más tarde o comuníquese con el soporte técnico.';
		$scope.pantalla.tipo = "panel-danger";
		$scope.pantalla.resultadoCorrelativo = [];
		$scope.loadingCorrelatividad = false;
	});

	$scope.controlCorrelatividad = function(){
		$scope.loadingCorrelatividad = true;
		invoiceFactory.getCorrelative($scope.model, function(dataComprob) {
			$scope.result = dataComprob;
			if ($scope.result.totalCount > 0){
				$scope.pantalla.mensajeCorrelativo = "Se hallaron " + $scope.result.totalCount + " " + $rootScope.vouchersType[$scope.model.codTipoComprob] + " faltantes: ";
				$scope.pantalla.tipo = "panel-danger";
				$scope.pantalla.titulo = "Error en el punto de venta " + $scope.model.nroPtoVenta;
				$scope.pantalla.resultadoCorrelativo = $scope.result.data;
			} else {
				$scope.pantalla.titulo =  "Éxito";
				$scope.pantalla.mensajeCorrelativo = "No se hallaron " + $rootScope.vouchersType[$scope.model.codTipoComprob] + " faltantes en el punto de venta " + $scope.model.nroPtoVenta;
				$scope.pantalla.tipo = "panel-success";
				$scope.pantalla.resultadoCorrelativo = [];
			}
			$scope.pantalla.fechaDesde = $scope.model.fechaDesde;
			$scope.pantalla.fechaHasta = $scope.model.fechaHasta;
			$rootScope.controlCorrelativo = $scope.pantalla;
			$scope.loadingCorrelatividad = false;
		});
	};

}