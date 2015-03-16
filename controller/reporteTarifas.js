/**
 * Created by artiom on 02/10/14.
 */

myapp.controller('reporteTarifasCtrl', ['$scope', 'reportsFactory', 'priceFactory', 'dialogs', 'loginService', function($scope, reportsFactory, priceFactory, dialogs, loginService) {
	$scope.maxDate = new Date();
	$scope.monedaFija = 'DOL';
	$scope.search = '';
	$scope.selectedList = [];
	$scope.pricelist = [];
	$scope.pricelistTasas = [];
	$scope.filteredPrices = [];

	$scope.loadingReporteTarifas = false;

	$scope.tarifasElegidas = 1;

	$scope.maxDate = new Date();

	$scope.paginaAnterior = 1;

	$scope.errorTarifario = false;

	$scope.configPanel = {
		tipo: 'panel-danger',
		titulo: 'Error',
		mensaje: 'Error al cargar los datos necesarios para generar el reporte.'
	};

	$scope.filteredPrices = [];
	$scope.tarifasGraficar = {
		"field": "code",
		"data": []
	};

	$scope.tablaGrafico = {
		"terminales": [],
		"data": []
	};

	$scope.tasas = false;

	$scope.$on('errorDatos', function(){
		$scope.errorTarifario = true;
	});

	$scope.$on('loginComplete', function(){
		priceFactory.getPrice('agp', false, function (data) {
			$scope.pricelist = data.data;
			$scope.pricelist.forEach(function (price) {
				price.graficar = false;
			});
			$scope.selectedList = $scope.pricelist;
		});
		priceFactory.getPrice('agp', true, function (data) {
			$scope.pricelistTasas = data.data;
			$scope.pricelistTasas.forEach(function (price) {
				price.graficar = false;
			});
		});
	});

	if (loginService.getStatus()){
		priceFactory.getPrice('agp', false, function (data) {
			$scope.pricelist = data.data;
			$scope.pricelist.forEach(function (price) {
				price.graficar = false;
			});
			$scope.selectedList = $scope.pricelist;
		});
		priceFactory.getPrice('agp', true, function (data) {
			$scope.pricelistTasas = data.data;
			$scope.pricelistTasas.forEach(function (price) {
				price.graficar = false;
			});
		});
	}

	$scope.recargarPricelist = function(){
		var pos;
		$scope.selectedList.forEach(function(price){
			if ($scope.tasas){
				pos = $scope.pricelistTasas.map(function(e) { return e._id}).indexOf(price._id);
				if (pos != -1){
					$scope.pricelistTasas[pos].graficar = price.graficar;
				}
			} else {
				pos = $scope.pricelist.map(function(e) { return e._id}).indexOf(price._id);
				if (pos != -1){
					$scope.pricelist[pos].graficar = price.graficar;
				}
			}
		});
		if ($scope.tasas){
			$scope.selectedList = $scope.pricelistTasas;
		} else {
			$scope.selectedList = $scope.pricelist;
		}
	};

	$scope.mostrarGrafico = false;

	$scope.columnChart = 'column';

	$scope.chartTitleReporteTarifas = "Códigos de tarifas";
	$scope.chartWidthReporteTarifas = 1200;
	$scope.chartHeightReporteTarifas = 600;
	$scope.chartDataReporteTarifas = [
		['Codigos', 'algo'],
		['hola', 2526]
	];

	$scope.hasta = new Date();
	$scope.desde = new Date($scope.hasta.getFullYear(), $scope.hasta.getMonth());

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'shortDate', 'yyyy-MM'];
	$scope.format = $scope.formats['yyyy-MM-dd'];

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
		$scope.filteredPrices.forEach(function (price) {
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
				if (contarTerminales != 0){
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
					console.log($scope.chartDataReporteTarifas);
					$scope.mostrarGrafico = true;
				} else {
					dialogs.notify("Totales por tarifa", "No se encontraron datos para las fechas y tarifas seleccionadas.");
				}
				$scope.loadingReporteTarifas = false;
			});
		}
	};

}]);