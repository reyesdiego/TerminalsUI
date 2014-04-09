/**
 * Created by kolesnikov-a on 21/02/14.
 */

function cfacturasCtrl($scope, invoiceFactory, priceFactory){
	'use strict';
	$scope.onOff = false;
	$scope.onOffResult = true;

	$scope.today = function() {
		$scope.desde = new Date();
		$scope.hasta = new Date();
	};

	$scope.today();

	$scope.showWeeks = true;
	$scope.toggleWeeks = function () {
		$scope.showWeeks = ! $scope.showWeeks;
	};

	$scope.clear = function () {
		$scope.dt = null;
	};

	$scope.toggleMin = function() {
		$scope.minDate = ( $scope.minDate ) ? null : new Date();
	};

	$scope.toggleMin();

	$scope.open = function($event, fecha) {
		$event.preventDefault();
		$event.stopPropagation();

		if (fecha === 'desde'){
			$scope.openDesde = true;
			$scope.openHasta = false;
		}else{
			$scope.openHasta = true;
			$scope.openDesde = false;
		}
	};

	$scope.dateOptions = {
		'year-format': "'yy'",
		'starting-day': 1
	};

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'shortDate'];
	$scope.format = $scope.formats[1];

	$scope.cargar = function(){
		invoiceFactory.getByDate($scope.desde, $scope.hasta, $scope.terminal, function(data) {
			console.log(data);
			$scope.result = data.data;

			$scope.control = 0;
			$scope.facturasFaltantes = [];
			$scope.codigosFaltantes = [];
			$scope.mensaje = ["No se hallaron anormalidades.", "Todos los códigos se encuentran asociados correctamente.", "Todas las facturas presentan tasas a las cargas."];
			$scope.cartel = ["panel-success", "panel-success", "panel-success"];
			$scope.titulo = ["Éxito", "Éxito", "Éxito"];

			$scope.onOff = true;
			$scope.onOffResult = false;

			priceFactory.getMatchPrices($scope.terminal, function(data){
				$scope.matchPricesTodo = data;
				$scope.tasasCargas = [];
				$scope.codigosTerminal = [];

				$scope.matchPrices.forEach(function(match){
					match.match.codes.codes.forEach(function(codigo){
						$scope.codigosTerminal.push(codigo);
					});
					if (es_substring("TC", match.id)){
						match.match.codes.codes.forEach(function(codigo){
							$scope.tasasCargas.push(codigo);
						});
					}
				})

				//Por ahora se esta realizando el chequeo contra el mock, el algoritmo está hecho suponiendo que
				//el rango de facturas por fecha viene ordenado, tampoco hay nada que me permita comprobar que el primer
				//comprobante sea el correcto...
				$scope.result.forEach(function(factura){
					if ($scope.control == 0) {
						$scope.control = factura.nroComprob;
					} else {
						$scope.control += 1;
						if ($scope.control != factura.nroComprob){
							$scope.faltantes.push($scope.control);
							$scope.control = factura.nroComprob;
							$scope.mensaje[0] = "Se hallaron facturas faltantes: ";
							$scope.cartel[0] = "panel-danger";
							$scope.titulo[0] = "Error"
						}
					}

					//Aca control de codigos
					factura.detalle.items.forEach(function(item){
						if (!in_array(item.id, $scope.codigosTerminal)){
							$scope.codigosFaltantes.push(item.id + " en la factura " + factura.id);
							$scope.mensaje[1] = "Se hallaron códigos sin asociar: ";
							$scope.cartel[1] = "panel-danger";
							$scope.titulo[1] = "Error"
						}
					})

					//aca control de tasa a las cargas
				})
			})

			$scope.volver = function(){
				$scope.onOff = false;
				$scope.onOffResult = true;
			}
		})
	};

}