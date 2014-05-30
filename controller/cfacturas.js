/**
 * Created by kolesnikov-a on 21/02/14.
 */

function cfacturasCtrl($scope, invoiceFactory, priceFactory, loginService){
	'use strict';

	// Fecha (dia y hora)
	$scope.hasta = new Date();
	$scope.desde = new Date($scope.hasta.getFullYear(), $scope.hasta.getMonth());
	$scope.terminoCarga = false;
	$scope.dateOptions = { 'startingDay': 0, 'showWeeks': false };
	$scope.format = 'yyyy-MM-dd';
	$scope.terminal = "BACTSSA";

	$scope.open = function($event, fecha) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.openFechaDesde = (fecha === 'desde');
		$scope.openFechaHasta = (fecha === 'hasta');
	};

	//Datos para los gráficos
	$scope.chartTitle = "Tipos comprobantes";
	$scope.chartWidth = 500;
	$scope.chartHeight = 320;

	$scope.cargar = function(){
		//Traigo todos los códigos de la terminal y me los guardo
		priceFactory.getMatchPrices($scope.terminal, null, function(data){
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

			$scope.tabs = [];
			invoiceFactory.getByDate($scope.desde, $scope.hasta, $scope.terminal, function(data) {

				$scope.result = data;

				$scope.result.tipoComprob.forEach(function(tipoComprobante){
					var tab = {
						"title":tipoComprobante.id,
						"tituloCorrelativo":  "Éxito",
						"mensajeCorrelativo": "No se hallaron facturas faltantes",
						"cartelCorrelativo": "panel-success",
						"resultadoCorrelativo": [],
						"tituloCodigos": "Éxito",
						"mensajeCodigos": "No se hallaron códigos sin asociar",
						"cartelCodigos": "panel-success",
						"resultadoCodigos": [],
						"totalFacturas": tipoComprobante.data.length,
						"totalFaltantes": 0,
						"active": 0,
						"mostrarResultado": 0
					};

					var columnaChart = [tipoComprobante.id, 0];
					var contador = 0;
					$scope.control = 0;

					//Por ahora se esta realizando el chequeo contra el mock, el algoritmo está hecho suponiendo que
					//el rango de facturas por fecha viene ordenado, tampoco hay nada que me permita comprobar que el primer
					//comprobante sea el correcto...
					tipoComprobante.data.forEach(function(factura){
						contador+=1;
						if ($scope.control == 0) {
							$scope.control = factura.nroComprob;
						} else {
							$scope.control += 1;
							if ($scope.control != factura.nroComprob){
								tab.resultadoCorrelativo.push($scope.control);
								$scope.control = factura.nroComprob;
								tab.mensajeCorrelativo = "Se hallaron facturas faltantes: ";
								tab.cartelCorrelativo = "panel-danger";
								tab.tituloCorrelativo = "Error";
								tab.totalFaltantes += 1;
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

					columnaChart[1] = contador;
					$scope.tabs.push(tab);
					$scope.chartData.push(columnaChart);
				});
				$scope.tabs[0].active = 1;
			});
			$scope.terminoCarga = true;
		});

		$scope.tasaCargas = {
			"titulo":"Éxito",
			"cartel": "panel-success",
			"mensaje": "No se hallaron facturas sin tasa a las cargas",
			"resultado": [],
			"mostrarResultado": 0
		};

		/*Acá control de tasa a las cargas*/
		 invoiceFactory.getSinTasaCargas($scope.desde, $scope.hasta, $scope.terminal, $scope.page, function(data){
		    $scope.tasaCargas.resultado = data;
			if ($scope.tasaCargas.resultado.length > 0){
				$scope.tasaCargas.titulo = "Error";
				$scope.tasaCargas.cartel = "panel-danger";
				$scope.tasaCargas.mensaje = "Se hallaron facturas sin tasa a las cargas.";
				$scope.tasaCargas.mostrarResultado = 1;
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
}