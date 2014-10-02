/**
 * Created by artiom on 02/10/14.
 */

var reporteTarifasCtrl = myapp.controller('reporteTarifasCtrl', function($scope, reportsFactory, priceFactory, loginService, dialogs, $state){

	$scope.maxDate = new Date();
	$scope.monedaFija = 'DOL';
	$scope.search = '';
	$scope.pricelist = [];
	$scope.filteredPrices = [];

	$scope.loadingReporteTarifas = false;

	$scope.tarifasElegidas = 1;

	$scope.maxDate = new Date();

	$scope.paginaAnterior = 1;

	$scope.filteredPrices = [];
	$scope.tarifasGraficar = {
		"field": "code",
		"data": []
	};
	$scope.tablaGrafico = [];

	$scope.tasas = false;

	priceFactory.getPrice('agp', $scope.tasas, function (data) {
		$scope.pricelist = data.data;
		$scope.pricelist.forEach(function (price) {
			price.graficar = false;
		});
		$scope.totalItems = $scope.pricelist.length;
	});

	$scope.recargarPricelist = function(){
		$scope.filteredPrices.forEach(function(price){
			var pos = $scope.filteredPrices.indexOf(price);
			$scope.pricelist[($scope.paginaAnterior-1)*$scope.itemsPerPage + pos].graficar = price.graficar;
		});
		var anteriorPricelist = $scope.pricelist.slice();
		priceFactory.getPrice('agp', $scope.tasas, function (data) {
			$scope.pricelist = data.data;
			anteriorPricelist.forEach(function(price){
				var pos = $scope.pricelist.map(function(e) { return e._id; }).indexOf(price._id);
				if (pos != -1){
					$scope.pricelist[pos].graficar = price.graficar;
				}
			});
			$scope.totalItems = $scope.pricelist.length;
			$scope.currentPage = 1;
		});
	};

	$scope.pageChanged = function(){
		$scope.filteredPrices.forEach(function(price){
			var pos = $scope.filteredPrices.indexOf(price);
			$scope.pricelist[($scope.paginaAnterior-1)*$scope.itemsPerPage + pos].graficar = price.graficar;
		});
		$scope.paginaAnterior = $scope.currentPage;
	};

	$scope.$watch('search', function(){
		if ($scope.search != "" && $scope.search != null){
			//Se supone que siempre que busca se limiten los resultados a una sola página, por eso seteo
			//el totalItems en 1
			$scope.totalItems = 1;
			if ($scope.search.length <= 1){
				//Una búsqueda con un solo caracter producía demasiados resultados, por lo que solo muestro los 10 primeros
				$scope.itemsPerPage = 10;
			} else {
				//Si los resultados estaban originalmente en una página distinta de la currentPage no se veían,
				//de este modo todos los resultados van hasta la única página
				$scope.itemsPerPage = $scope.pricelist.length;
			}
		} else {
			$scope.totalItems = $scope.pricelist.length;
			$scope.itemsPerPage = 10;
		}
	});

	$scope.mostrarGrafico = false;

	$scope.chartTitleReporteTarifas = "Códigos de tarifas";
	$scope.chartWidthReporteTarifas = 1200;
	$scope.chartHeightReporteTarifas = 600;
	$scope.chartDataReporteTarifas = [
		['Codigos', 'algo'],
		['hola', 2526]
	];

	$scope.hasta = new Date();
	$scope.desde = new Date($scope.hasta.getFullYear(), $scope.hasta.getMonth());

	$scope.monthMode = 'month';
	$scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'shortDate', 'yyyy-MM'];
	$scope.format = $scope.formats['yyyy-MM-dd'];
	$scope.formatSoloMes = $scope.formats[3];
	$scope.terminoCarga = false;
	$scope.tipoComprobante = "0";

	$scope.isCollapsedDesde = true;
	$scope.isCollapsedHasta = true;

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

	$scope.cargaPorFiltros = function () {
		$scope.cargarReporteHorarios();
	};

	$scope.armarGraficoTarifas = function () {
		$scope.loadingReporteTarifas = true;
		$scope.tarifasGraficar = {
			"field": "code",
			"data": []
		};
		$scope.tablaGrafico = {
			"terminales": [],
			"data": []
		};
		$scope.pricelist.forEach(function (price) {
			if (price.graficar){
				$scope.tarifasGraficar.data.push(price.code);
				$scope.tablaGrafico.data.push(price);
			}
		});
		if ($scope.tarifasGraficar.data.length <= 0){
			dialogs.notify("Totales por tarifa", "No se ha seleccionado ninguna tarifa para graficar.");
			$scope.mostrarGrafico = false;
			$scope.loadingReporteTarifas = false;
		} else {
			var base = [
				['Códigos']
			];
			var nuevaLinea = [];
			var contarTerminales = 0;
			var terminales = [];
			var fecha={
				'fechaInicio': $scope.desde,
				'fechaFin': $scope.hasta
			};
			reportsFactory.getReporteTarifas(fecha, $scope.tarifasGraficar, function(data){
				contarTerminales = data.data.length;
				data.data.forEach(function(resultado){
					nuevaLinea.push(resultado.terminal);
					base.push(nuevaLinea.slice());
					terminales.push(resultado.terminal);
					nuevaLinea = [];
				});
				var i = 1;
				$scope.tarifasElegidas = $scope.tablaGrafico.data.length;
				$scope.tablaGrafico.terminales = terminales;
				$scope.tablaGrafico.data.forEach(function(tarifa){
					var total = 0;
					var code = tarifa.code;
					tarifa.conteo = [];
					tarifa.porcentaje = [];
					base[0].push(code);
					for (i=1; i<=contarTerminales; i++){
						if (angular.isDefined(data.data[i-1].data[code])){
							base[i].push(data.data[i-1].data[code]);
							tarifa.conteo.push(data.data[i-1].data[code]);
							total+=data.data[i-1].data[code];
						} else {
							base[i].push(0);
							tarifa.conteo.push(0);
						}
					}
					tarifa.conteo.push(total);
					for (i=0; i<=contarTerminales-1; i++){
						var cuenta = (tarifa.conteo[i]*100)/tarifa.conteo[contarTerminales];
						tarifa.porcentaje.push(cuenta);
					}
				});
				$scope.chartDataReporteTarifas = base;
				$scope.mostrarGrafico = true;
				$scope.loadingReporteTarifas = false;
			});
		}
	};
});