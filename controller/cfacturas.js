/**
 * Created by kolesnikov-a on 21/02/14.
 */

function cfacturasCtrl($scope, invoiceFactory, priceFactory){
	'use strict';

	// Fecha (dia y hora)
	$scope.desde = new Date();
	$scope.hasta = new Date();
	$scope.dateOptions = { 'year-format': "'yy'", 'starting-day': 1 };
	$scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'shortDate'];
	$scope.format = $scope.formats[1];
	$scope.open = function($event, fecha) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.openFechaDesde = (fecha === 'desde');
		$scope.openFechaHasta = (fecha === 'hasta');
	};

	$scope.cargar = function(){
		//Traigo todos los códigos de la terminal y me los guardo
		priceFactory.getMatchPrices($scope.terminal, function(data){
			$scope.matchPrices = data;
			$scope.codigosTerminal = [];

			$scope.matchPrices.forEach(function(match){
				if (match.match != null){
					match.match.codes.forEach(function(codigo){
						$scope.codigosTerminal.push(codigo);
					});
				}
			});

			$scope.tabs = [];

			invoiceFactory.getByDate($scope.desde, $scope.hasta, $scope.terminal, function(data) {

				console.log(data);
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
						"totalFaltantes": 0
					};

					$scope.control = 0;

					//Por ahora se esta realizando el chequeo contra el mock, el algoritmo está hecho suponiendo que
					//el rango de facturas por fecha viene ordenado, tampoco hay nada que me permita comprobar que el primer
					//comprobante sea el correcto...
					tipoComprobante.data.forEach(function(factura){
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
							}
						})*/
					});

					console.log(tab.totalFaltantes);
					$scope.tabs.push(tab);
				});

			});

			/*Acá control de tasa a las cargas
			invoiceFactory.getSinTasaCargas($scope.desde, $scope.hasta, $scope.terminal, function(data){
				$scope.sinTasaCargas = data;
			})*/

		})
	};

}