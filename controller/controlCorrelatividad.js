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
		'fechaHasta': $scope.hasta,
		'order': ''
	};

	$scope.ocultarFiltros = ['nroComprobante', 'documentoCliente', 'contenedor', 'codigo', 'razonSocial', 'estado', 'buque'];
	$scope.model.codTipoComprob = 1;

	$scope.pantalla = {
		"tituloCorrelativo":  "Correlatividad",
		"mensajeCorrelativo": "Seleccione punto de venta y tipo de comprobante para realizar la búsqueda",
		"cartelCorrelativo": "panel-info",
		"resultadoCorrelativo": []
	};

	$scope.filtrar = function(filtro, contenido){
		switch (filtro) {
			case 'nroPtoVenta':
				$scope.model.nroPtoVenta = contenido;
				break;
		}
		$scope.controlCorrelatividad();
	};

	$scope.traerPuntosDeVenta = function(){
		invoiceFactory.getCashbox({}, function(data){
			$scope.terminalSellPoints = data.data;
		})
	};

	$scope.controlCorrelatividad = function(){
		$scope.loadingCorrelatividad = true;
		invoiceFactory.getCorrelative(cargaDatos(), function(dataComprob) {
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

	function cargaDatos(){
		return {
			'nroPtoVenta': $scope.model.nroPtoVenta,
			'codTipoComprob': $scope.model.codTipoComprob,
			'fechaDesde': $scope.model.fechaDesde,
			'fechaHasta': $scope.model.fechaHasta,
			'order': $scope.model.order
		};
	}

	$scope.traerPuntosDeVenta();

}