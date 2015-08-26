/**
 * Created by Diego Reyes on 1/29/14.
 */

myapp.controller('pricelistCtrl', ['$rootScope', '$scope', 'priceFactory', 'loginService', 'unitTypesArrayCache', 'downloadFactory', 'dialogs', 'generalCache',
	function($rootScope, $scope, priceFactory, loginService, unitTypesArrayCache, downloadFactory, dialogs, generalCache) {

		'use strict';
		// Variable para almacenar la info principal que trae del factory
		$scope.unidadesTarifas = generalCache.get('unitTypes');
		$scope.pricelist = [];
		$scope.filteredPrices = [];
		$scope.tasas = false;
		$scope.itemsPerPage = 10;
		$scope.hayError = false;

		$scope.$on('cambioPagina', function(event, data){
			$scope.currentPage = data;
		});

		$scope.$on('errorInesperado', function(e, mensaje){
			$scope.hayError = true;
			$scope.mensajeResultado = mensaje;
		});

		$scope.cargaPricelist = function(){
			priceFactory.getPrice(loginService.getFiltro(), $scope.tasas, function (data) {
				if (data.status == 'OK'){
					$scope.hayError = false;
					$scope.pricelist = data.data;
					$scope.pricelist.forEach(function(tarifa){
						if (angular.isDefined(tarifa.unit) && tarifa.unit != null && angular.isDefined(unitTypesArrayCache.get(tarifa.unit))){
							tarifa.idUnit = tarifa.unit;
							tarifa.unit = unitTypesArrayCache.get(tarifa.unit);
						}
						if (!angular.isDefined(tarifa.topPrices[0].price || tarifa.topPrices[0].price == null)){
							tarifa.orderPrice = 0;
						} else {
							tarifa.orderPrice = tarifa.topPrices[0].price;
						}
					});
					$scope.totalItems = $scope.pricelist.length;
				} else {
					$scope.hayError = true;
					$scope.mensajeResultado = {
						titulo: 'Tarifario',
						mensaje: 'Se ha producido un error al cargar los datos del tarifario.',
						tipo: 'panel-danger'
					};
				}
			});
		};

		$scope.exportarAPdf = function(){
			var data = {
				terminal: loginService.getFiltro(),
				pricelist: $scope.filteredPrices
			};
			downloadFactory.convertToPdf(data, 'pricelistToPdf', function(data, status){
				if (status == 'OK'){
					var file = new Blob([data], {type: 'application/pdf'});
					var fileURL = URL.createObjectURL(file);
					window.open(fileURL);
				} else {
					dialogs.error('Tarifario', 'Se ha producido un error al intentar exportar el tarifario a PDF');
				}
			})
		};

		$scope.exportarAExcel = function(){
			var tabla = "<table>" +
				"			<tr>" +
				"				<td>Código</td>" +
				"				<td>Descripción</td>" +
				"				<td>Unidad</td>" +
				"				<td>Tope</td>" +
				"		</tr>";

			$scope.filteredPrices.forEach(function(price){
				tabla += "<tr>" +
					"		<td>" + price.code + "</td>" +
					"		<td>" + price.description + "</td>" +
					"		<td>" + price.unit + "</td>" +
					"		<td>" + price.topPrices[0].price + "</td>" +
					"	</tr>"
			});

			tabla += "</table>";

			var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
			excelFile += "<head>";
			excelFile += "<!--[if gte mso 9]>";
			excelFile += "<xml>";
			excelFile += "<x:ExcelWorkbook>";
			excelFile += "<x:ExcelWorksheets>";
			excelFile += "<x:ExcelWorksheet>";
			excelFile += "<x:Name>";
			excelFile += "{worksheet}";
			excelFile += "</x:Name>";
			excelFile += "<x:WorksheetOptions>";
			excelFile += "<x:DisplayGridlines/>";
			excelFile += "</x:WorksheetOptions>";
			excelFile += "</x:ExcelWorksheet>";
			excelFile += "</x:ExcelWorksheets>";
			excelFile += "</x:ExcelWorkbook>";
			excelFile += "</xml>";
			excelFile += "<![endif]-->";
			excelFile += "</head>";
			excelFile += "<body>";
			excelFile += tabla;
			excelFile += "</body>";
			excelFile += "</html>";

			var base64data = "base64," + btoa(unescape(encodeURIComponent(excelFile)));
			window.open('data:application/vnd.ms-excel;filename=exportData.doc;' + base64data);
		};

		$scope.guardarCambios = function(){
			console.log($scope.filteredPrices);
		};

		if (loginService.getStatus()) $scope.cargaPricelist();

		$scope.$on('terminoLogin', function(){
			$scope.cargaPricelist();
		});

		$scope.$on('cambioTerminal', function(){
			$scope.cargaPricelist();
		});

	}]);