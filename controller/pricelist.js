/**
 * Created by Diego Reyes on 1/29/14.
 */

myapp.controller('pricelistCtrl', ['$rootScope', '$scope', 'priceFactory', 'loginService', 'unitTypesArrayCache', 'downloadFactory', 'dialogs', 'generalCache', 'generalFunctions', '$filter',
	function($rootScope, $scope, priceFactory, loginService, unitTypesArrayCache, downloadFactory, dialogs, generalCache, generalFunctions, $filter) {

		'use strict';
		// Variable para almacenar la info principal que trae del factory
		$scope.unidadesTarifas = generalCache.get('unitTypes');
		$scope.pricelist = [];
		$scope.filteredPrices = [];
		$scope.userPricelist = [];
		$scope.tasas = false;
		$scope.itemsPerPage = 10;
		$scope.hayError = false;

		$scope.fechaVigencia = new Date();

		$scope.openDate = function(e){
			generalFunctions.openDate(e);
		};

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
						tarifa.nuevoTopPrice = {
							currency: tarifa.topPrices[0].currency,
							price: tarifa.orderPrice,
							from: $scope.fechaVigencia
						};
					});
					$scope.totalItems = $scope.pricelist.length;
					$scope.userPricelist = angular.copy($scope.pricelist);
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
			var i;
			var changesList = [];
			for (i=0; i <= $scope.pricelist.length - 1; i++){
				if (!angular.equals($scope.userPricelist[i], $scope.pricelist[i])){
					$scope.userPricelist[i].nuevoTopPrice.from = $scope.fechaVigencia;
					$scope.userPricelist[i].topPrices.push($scope.userPricelist[i].nuevoTopPrice);
					$scope.userPricelist[i].unit = $scope.userPricelist[i].idUnit;
					changesList.push($scope.userPricelist[i]);
				}
			}
			if (changesList.length > 0){
				var res = dialogs.confirm('Tarifario', 'Se guardarán los cambios para las ' + changesList.length + ' tarifas modificadas, con fecha de vigencia a partir del ' + $filter('date')($scope.fechaVigencia, 'dd/MM/yyyy'))
				res.result.then(function(){
					var pricelistData = {
						fechaVigencia: $scope.fechaVigencia,
						prices: changesList
					};
					/*priceFactory.savePriceList(pricelistData, function(data){
						if (data.status == 'OK'){

						} else {

						}
					});
					//acá guardar los datos*/
					console.log(pricelistData);
				})
			} else {
				dialogs.notify('Tarifario', 'No se han producido cambios en el tarifario.');
			}
		};

		if (loginService.getStatus()) $scope.cargaPricelist();

		$scope.$on('terminoLogin', function(){
			$scope.cargaPricelist();
		});

		$scope.$on('cambioTerminal', function(){
			$scope.cargaPricelist();
		});

	}]);