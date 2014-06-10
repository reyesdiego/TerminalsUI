/**
 * Created by kolesnikov-a on 21/02/14.
 */

function cfacturasCtrl($rootScope, $scope, invoiceFactory, priceFactory){
	'use strict';

	// Fecha (dia y hora)
	$scope.hasta = new Date();
	$scope.desde = new Date($scope.hasta.getFullYear(), $scope.hasta.getMonth());
	$scope.terminoCarga = false;
	$scope.dateOptions = { 'startingDay': 0, 'showWeeks': false };
	$scope.format = 'yyyy-MM-dd';
	$scope.terminalFacturas = "BACTSSA";
	$scope.verDetalle = "";
	$scope.tipoComprobante = "0";

	$scope.open = function($event, fecha) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.openFechaDesde = (fecha === 'desde');
		$scope.openFechaHasta = (fecha === 'hasta');
	};

	$scope.currentPageTasaCargas = 1;
	$scope.totalItemsTasaCargas = 0;

	$scope.cargar = function(){
		//Traigo todos los códigos de la terminal y me los guardo
		console.log($scope.tipoComprobante);
		console.log($rootScope.vouchersType);
		priceFactory.getMatchPrices($scope.terminalFacturas, null, function(data){
			$scope.chartData = [
				['Tipo de comprobante', 'Total']
			];

			$scope.matchPrices = data.data;
			$scope.codigosTerminal = [];

			$scope.matchPrices.forEach(function(match){
				if (match.matches != null && match.matches.length > 0){
					match.matches[0].match.forEach(function(codigo){
						$scope.codigosTerminal.push(codigo);
					});
				}
			});

			invoiceFactory.getByDate($scope.desde, $scope.hasta, $scope.terminalFacturas, $scope.tipoComprobante, function(dataComprob) {

				$scope.result = dataComprob;

				$scope.pantalla = {
					"tituloCorrelativo":  "Éxito",
					"mensajeCorrelativo": "No se hallaron facturas faltantes",
					"cartelCorrelativo": "panel-success",
					"resultadoCorrelativo": [],
					"tituloCodigos": "Éxito",
					"mensajeCodigos": "No se hallaron códigos sin asociar",
					"cartelCodigos": "panel-success",
					"resultadoCodigos": [],
					"totalFacturas": $scope.result.data.length,
					"totalFaltantes": 0,
					"active": 0,
					"mostrarResultado": 0
				};

				var contador = 0;
				$scope.control = 0;

				//Por ahora se esta realizando el chequeo contra el mock, el algoritmo está hecho suponiendo que
				//el rango de facturas por fecha viene ordenado, tampoco hay nada que me permita comprobar que el primer
				//comprobante sea el correcto...
				$scope.result.data.forEach(function(comprob){
					contador+=1;
					if ($scope.control == 0) {
						$scope.control = comprob.nroComprob;
					} else {
						$scope.control += 1;
						if ($scope.control != comprob.nroComprob){
							$scope.pantalla.resultadoCorrelativo.push($scope.control);
							$scope.control = comprob.nroComprob;
							$scope.pantalla.mensajeCorrelativo = "Se hallaron facturas faltantes: ";
							$scope.pantalla.cartelCorrelativo = "panel-danger";
							$scope.pantalla.tituloCorrelativo = "Error";
							$scope.pantalla.totalFaltantes += 1;
						}
					}

					/*Aca control de codigos
					 factura.detalle.items.forEach(function(item){
					 if (!in_array(item.id, $scope.codigosTerminal)){
					 tab.resultadoCodigos.push(item.id + " en la factura " + factura.id);
					 tab.mensajeCodigos = "Se hallaron códigos sin asociar: ";
					 tab.cartelCodigos = "panel-danger";
					 tab.tituloCodigos = "Error";
					 tab.mostrarResultado = 1;
					 }
					 })*/
				});
			});
			$scope.terminoCarga = true;
		});

		$scope.tasaCargas = {
			"titulo":"Éxito",
			"cartel": "panel-success",
			"mensaje": "No se hallaron facturas sin tasa a las cargas.",
			"resultado": [],
			"mostrarResultado": 0
		};

		/*Acá control de tasa a las cargas*/
		invoiceFactory.getSinTasaCargas($scope.desde, $scope.hasta, $scope.terminalFacturas, $scope.page, function(data){
			if (data.status == "ERROR"){
				$scope.tasaCargas.titulo = "Error";
				$scope.tasaCargas.cartel = "panel-danger";
				$scope.tasaCargas.mensaje = "La terminal seleccionada no tiene códigos asociados.";
				$scope.tasaCargas.mostrarResultado = 0;
			} else {
				$scope.tasaCargas.resultado = data.data;
				console.log($scope.tasaCargas.resultado);
				if ($scope.tasaCargas.resultado.length > 0){
					$scope.totalItemsTasaCargas = data.totalCount;
					$scope.tasaCargas.titulo = "Error";
					$scope.tasaCargas.cartel = "panel-danger";
					$scope.tasaCargas.mensaje = "Se hallaron facturas sin tasa a las cargas.";
					$scope.tasaCargas.mostrarResultado = 1;
				}
			}
		 })
	};

	$scope.deleteRow = function (index) {
		$scope.chartData.splice(index, 1);
	};
	$scope.addRow = function () {
		$scope.chartData.push([]);
	};
	$scope.selectRow = function (index) {
		$scope.selected = index;
	};
	$scope.rowClass = function (index) {
		return ($scope.selected === index) ? "selected" : "";
	};

	$scope.cargar();

	$scope.mostrarDetalle = function(unaFactura){
		$scope.verDetalle = unaFactura;
	};

	$scope.$watch('currentPageTasaCargas', function(){
		$scope.page.skip = (($scope.currentPageTasaCargas - 1) * $scope.itemsPerPage);
		invoiceFactory.getSinTasaCargas($scope.desde, $scope.hasta, $scope.terminalFacturas, $scope.page, function(data){
			if (data.status == "ERROR"){
				$scope.tasaCargas.titulo = "Error";
				$scope.tasaCargas.cartel = "panel-danger";
				$scope.tasaCargas.mensaje = "La terminal seleccionada no tiene códigos asociados.";
				$scope.tasaCargas.mostrarResultado = 0;
			} else {
				$scope.tasaCargas.resultado = data.data;
				console.log($scope.tasaCargas.resultado);
				if ($scope.tasaCargas.resultado.length > 0){
					$scope.totalItemsTasaCargas = data.totalCount;
					$scope.tasaCargas.titulo = "Error";
					$scope.tasaCargas.cartel = "panel-danger";
					$scope.tasaCargas.mensaje = "Se hallaron facturas sin tasa a las cargas.";
					$scope.tasaCargas.mostrarResultado = 1;
				}
			}
		})
	});

}