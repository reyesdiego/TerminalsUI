/**
 * Created by artiom on 23/09/14.
 */

function tasaCargasCtrl($scope, invoiceFactory, loginService){

	$scope.ocultarFiltros = ['nroPtoVenta', 'nroComprobante', 'codComprobante', 'documentoCliente', 'codigo', 'fechaDesde', 'fechaHasta', 'estado', 'buque'];

	$scope.model = {
		'razonSocial': '',
		'contenedor': '',
		'order': ''
	};

	$scope.tasaCargas = {
		"titulo":"Éxito",
		"cartel": "panel-success",
		"mensaje": "No se hallaron comprobantes sin tasa a las cargas.",
		"resultado": [],
		"mostrarResultado": 0
	};

	$scope.comprobantesVistosTasas = [];

	$scope.loadingTasaCargas = true;

	$scope.$on('cambioPagina', function(event, data){
		$scope.currentPage = data;
		$scope.controlTasaCargas();
	});

	$scope.$on('cambioFiltro', function(event, data){
		$scope.currentPage = 1;
		$scope.model = data;
		$scope.controlTasaCargas()
	});

	$scope.controlTasaCargas = function(){
		/*Acá control de tasa a las cargas*/
		$scope.loadingTasaCargas = true;
		$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		invoiceFactory.getSinTasaCargas($scope.model, loginService.getFiltro(), $scope.page, function(data){
			if (data.status == "ERROR"){
				$scope.tasaCargas.titulo = "Error";
				$scope.tasaCargas.cartel = "panel-danger";
				$scope.tasaCargas.mensaje = "La terminal seleccionada no tiene códigos asociados.";
				$scope.tasaCargas.mostrarResultado = 0;
			} else {
				$scope.tasaCargas.resultado = data.data;
				if ($scope.tasaCargas.resultado.length > 0){
					$scope.totalItems = data.totalCount;
					$scope.tasaCargas.titulo = "Error";
					$scope.tasaCargas.cartel = "panel-danger";
					$scope.tasaCargas.mensaje = "Se hallaron comprobantes sin tasa a las cargas.";
					$scope.tasaCargas.mostrarResultado = 1;
				} else {
					$scope.tasaCargas = {
						"titulo":"Éxito",
						"cartel": "panel-success",
						"mensaje": "No se hallaron comprobantes sin tasa a las cargas.",
						"resultado": [],
						"mostrarResultado": 0
					};
				}
			}
			$scope.loadingTasaCargas = false;
		});
	};

}
