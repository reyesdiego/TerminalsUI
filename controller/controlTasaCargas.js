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

	$scope.filtrar = function(){
		$scope.page.skip = 0;
		if ($scope.page.skip == 0){ $scope.currentPage = 1}
		$scope.controlTasaCargas();
	};

	$scope.controlTasaCargas = function(){
		/*Acá control de tasa a las cargas*/
		$scope.loadingTasaCargas = true;
		invoiceFactory.getSinTasaCargas(cargaDatos(), loginService.getFiltro(), $scope.page, function(data){
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

	$scope.mostrarDetalle = function(comprobante){
		var encontrado = false;

		$scope.comprobantesVistosTasas.forEach(function(unComprobante){
			if (unComprobante._id == comprobante._id){
				encontrado = true;
			}
		});
		if (!encontrado){
			$scope.comprobantesVistosTasas.push(comprobante);
		}

		invoiceFactory.invoiceById(comprobante._id, function(miComprobante){
			$scope.verDetalle = miComprobante;
			$scope.$emit('recargarDetalle', $scope.verDetalle);
		});
	};

	$scope.pageChanged = function(){
		$scope.page.skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
		invoiceFactory.getSinTasaCargas(cargaDatos(), loginService.getFiltro(), $scope.page, function(data){
			if (data.status == "ERROR"){
				$scope.tasaCargas.titulo = "Error";
				$scope.tasaCargas.cartel = "panel-danger";
				$scope.tasaCargas.mensaje = "La terminal seleccionada no tiene códigos asociados.";
				$scope.tasaCargas.mostrarResultado = 0;
			} else {
				$scope.tasaCargas.resultado = data.data;
				if ($scope.tasaCargas.resultado.length > 0) {
					$scope.totalItems = data.totalCount;
					$scope.tasaCargas.titulo = "Error";
					$scope.tasaCargas.cartel = "panel-danger";
					$scope.tasaCargas.mensaje = "Se hallaron comprobantes sin tasa a las cargas.";
					$scope.tasaCargas.mostrarResultado = 1;
				}
			}
		});
	};

	function cargaDatos(){
		return {
			'razonSocial': $scope.model.razonSocial,
			'contenedor': $scope.model.contenedor,
			'order': $scope.model.order
		};
	}

	$scope.controlTasaCargas();

}
