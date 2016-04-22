/**
 * Created by Diego Reyes on 1/29/14.
 */

myapp.controller('pricelistCtrl', ['$rootScope', '$scope', 'priceFactory', 'loginService', 'unitTypesArrayCache', 'downloadFactory', 'dialogs', 'generalCache', 'generalFunctions', '$filter', 'cacheFactory', '$q',
	function($rootScope, $scope, priceFactory, loginService, unitTypesArrayCache, downloadFactory, dialogs, generalCache, generalFunctions, $filter, cacheFactory, $q) {

		'use strict';
		//Array con los tipos de tarifas para establecer filtros
		$scope.tiposTarifas = [
			{nombre: 'AGP', active: true},
			{nombre: 'Servicios', active: false},
			{nombre: 'Propios', active: false}
		];

		// Variable para almacenar la info principal que trae del factory
		$scope.unidadesTarifas = generalCache.get('unitTypes');
		$scope.pricelist = [];
		$scope.filteredPrices = [];
		$scope.userPricelist = [];
		$scope.pricelistAgp = [];
		$scope.servicios = [];
		$scope.pricelistTerminal = [];
		$scope.listaElegida = [];
		$scope.tasas = false;
		$scope.itemsPerPage = 10;
		$scope.hayError = false;
		$scope.disableSave = false;

		$scope.fechaVigencia = new Date();

		$scope.openDate = function(e){
			generalFunctions.openDate(e);
		};

		$scope.cambiarTarifas = function(tipoTarifa){
			$scope.tiposTarifas.forEach(function(unaTarifa){
				unaTarifa.active = (unaTarifa.nombre == tipoTarifa.nombre);
			});
			if (tipoTarifa.nombre == 'AGP'){
				$scope.listaElegida = angular.copy($scope.pricelistAgp);
			} else if (tipoTarifa.nombre == 'Servicios'){
				$scope.listaElegida = angular.copy($scope.servicios);
			} else {
				$scope.listaElegida = angular.copy($scope.pricelistTerminal);
			}
			$scope.totalItems = $scope.listaElegida.length
		};

		$scope.$on('cambioPagina', function(event, data){
			$scope.currentPage = data;
		});

		$scope.$on('errorInesperado', function(e, mensaje){
			$scope.hayError = true;
			$scope.mensajeResultado = mensaje;
		});

		$scope.actualizarPricelist = function(){
			$scope.pricelistAgp = [];
			priceFactory.getPrice(loginService.getFiltro(), $scope.tasas, function(data){
				if (data.status == 'OK'){
					$scope.hayError = false;
					$scope.pricelist = data.data;
					$scope.pricelist.forEach(function(tarifa){
						if (tarifa.terminal == 'AGP') $scope.pricelistAgp.push(tarifa);
					});
					$scope.listaElegida = angular.copy($scope.pricelistAgp);
					$scope.totalItems = $scope.listaElegida.length;
					$scope.userPricelist = angular.copy($scope.pricelistAgp);

				} else {
					$scope.hayError = true;
					$scope.mensajeResultado = {
						titulo: 'Tarifario',
						mensaje: 'Se ha producido un error al cargar los datos del tarifario.',
						tipo: 'panel-danger'
					};
				}
			})
		};

		$scope.cargaPricelist = function(){
			$scope.pricelistAgp = [];
			$scope.pricelistTerminal = [];
			$scope.servicios = [];
			$scope.listaElegida = [];
			//priceFactory.getPrice(loginService.getFiltro(), $scope.tasas, function (data) {
			priceFactory.getMatchPrices({onlyRates: $scope.tasas}, loginService.getFiltro(), function(data){
				if (data.status == 'OK'){
					$scope.hayError = false;
					$scope.pricelist = data.data;
					$scope.pricelist.forEach(function(tarifa){
						var tarifaPropia = false;
						if (!angular.isDefined(tarifa.topPrices[0].price || tarifa.topPrices[0].price == null)){
							tarifa.orderPrice = 0;
						} else {
							tarifa.orderPrice = tarifa.topPrices[0].price;
							tarifa.orderCurrency = tarifa.topPrices[0].currency;
						}
						tarifa.nuevoTopPrice = {
							currency: tarifa.topPrices[0].currency,
							price: tarifa.orderPrice,
							from: $scope.fechaVigencia
						};
						if (tarifa.terminal == 'AGP'){
							$scope.pricelistAgp.push(tarifa);
						} else {
							if (angular.isDefined(tarifa.matches) && tarifa.matches != null && tarifa.matches.length > 0 && tarifa.matches[0].match.length > 0){
								if (tarifa.matches[0].match.length >= 1){
									tarifa.matches[0].match.forEach(function(unMatch){
										if (unMatch == tarifa.code){
											tarifaPropia = true;
										}
									});
									tarifaPropia ? $scope.pricelistTerminal.push(tarifa) : $scope.servicios.push(tarifa);
								}
							} else {
								$scope.servicios.push(tarifa);
							}
						}
						if (angular.isDefined(tarifa.unit) && tarifa.unit != null && angular.isDefined(unitTypesArrayCache.get(tarifa.unit))){
							tarifa.idUnit = tarifa.unit;
							tarifa.unit = unitTypesArrayCache.get(tarifa.unit);
						}
					});
					$scope.listaElegida = angular.copy($scope.pricelistAgp);
					$scope.totalItems = $scope.listaElegida.length;
					$scope.userPricelist = angular.copy($scope.pricelistAgp);
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

		$scope.showDetail = function(index){
			var realIndex = ($scope.currentPage - 1) * $scope.itemsPerPage + index;
			$scope.filteredPrices[realIndex].SHOW = !$scope.filteredPrices[realIndex].SHOW;
		};


		$scope.exportarAPdf = function(){
			var data = {
				terminal: loginService.getFiltro(),
				pricelist: $scope.filteredPrices
			};
			var nombreReporte = 'Tarifario' + $filter('date')(new Date(), 'ddMMyyyy', 'UTC');
			downloadFactory.convertToPdf(data, 'pricelistToPdf', function(data, status){
				if (status == 'OK'){
					var file = new Blob([data], {type: 'application/pdf'});
					var fileURL = URL.createObjectURL(file);

					var anchor = angular.element('<a/>');
					anchor.css({display: 'none'}); // Make sure it's not visible
					angular.element(document.body).append(anchor); // Attach to document

					anchor.attr({
						href: fileURL,
						target: '_blank',
						download: nombreReporte
					})[0].click();

					anchor.remove(); // Clean it up afterwards
					//window.open(fileURL);
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

		$scope.guardarTarifa = function(tarifa){
			var deferred = $q.defer();

			priceFactory.savePriceChanges(tarifa, tarifa._id, function(data){
				if (data.status == 'OK'){
					deferred.resolve();
				} else {
					deferred.reject();
				}
			});

			return deferred.promise;
		};

		$scope.guardarCambios = function(){
			var i;
			var changesList = [];
			for (i=0; i < $scope.userPricelist.length - 1; i++){
				if (!angular.equals($scope.userPricelist[i], $scope.pricelist[i])){
					$scope.userPricelist[i].nuevoTopPrice.from = $scope.fechaVigencia;
					$scope.userPricelist[i].topPrices.push($scope.userPricelist[i].nuevoTopPrice);
					$scope.userPricelist[i].unit = $scope.userPricelist[i].idUnit;
					if ($scope.userPricelist[i].nuevoTopPrice.price == $scope.userPricelist[i].orderPrice && $scope.userPricelist[i].nuevoTopPrice.currency == $scope.userPricelist[i].orderCurrency){
						var aux = angular.copy($scope.userPricelist[i]);
						aux.nuevoTopPrice = null;
						changesList.push(aux);
					} else {
						changesList.push($scope.userPricelist[i]);
					}
				}
			}
			var llamadas = [];
			if (changesList.length > 0){
				var res = dialogs.confirm('Tarifario', 'Se guardarán los cambios para las ' + changesList.length + ' tarifas modificadas, con fecha de vigencia a partir del ' + $filter('date')($scope.fechaVigencia, 'dd/MM/yyyy HH:mm'))
				res.result.then(function(){
					$scope.disableSave = true;
					changesList.forEach(function(price){
						delete price.nuevoTopPrice;
						delete price.idUnit;

						llamadas.push($scope.guardarTarifa(price))
					});
					$q.all(llamadas)
							.then(function(){
								dialogs.notify('Tarifario', 'El tarifario se ha actualizado correctamente');
								cacheFactory.actualizarMatchesArray(loginService.getFiltro());
								$scope.cargaPricelist();
								$scope.disableSave = false;
							}, function(){
								dialogs.error('Tarifario', 'Se ha producido un erro al actualizar el tarifario');
								$scope.cargaPricelist();
								$scope.disableSave = false;
							});
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