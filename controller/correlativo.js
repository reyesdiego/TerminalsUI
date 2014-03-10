/**
 * Created by kolesnikov-a on 21/02/14.
 */

function correlativoCtrl($scope, invoiceFactory){
	'use strict';
	$scope.filteredInvoices = []
	$scope.itemsPerPage = 10;
	$scope.currentPage = 1;
	$scope.maxSize = 5;
	$scope.onOff = false;
	$scope.onOffResult = true;

	var page = {skip:0, limit: $scope.itemsPerPage};

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
		invoiceFactory.getByDate(page, $scope.desde, $scope.hasta, 'BACTSSA', function(data) {
			console.log(data);
			$scope.result = data.data;

			$scope.totalItems = data.totalCount;

			$scope.setPage = function (pageNo) {
				$scope.currentPage = pageNo;
			};

			//esta funcion debe ser reemplazada por una llamada al servidor que devuelva el total de facturas
			$scope.numPages = function () {
				return Math.ceil($scope.totalItems / $scope.itemsPerPage);
			};

			$scope.$watch('currentPage + itemsPerPage', function() {
				var skip = (($scope.currentPage - 1) * $scope.itemsPerPage);
				page.skip = skip;
				invoiceFactory.getByDate(page, $scope.desde, $scope.hasta, 'BACTSSA', function(data) {
					$scope.result = data.data;
				})
				$scope.filtro = '';
			});

			$scope.control = 0;
			$scope.faltantes = [];
			$scope.mensaje = "No se hallaron anormalidades.";

			$scope.onOff = true;
			$scope.onOffResult = false;

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
						$scope.mensaje = "Se hallaron facturas faltantes: ";
						$scope.control = factura.nroComprob;
					}
				}

			})

			$scope.volver = function(){
				$scope.onOff = false;
				$scope.onOffResult = true;
			}
		})
	};

}