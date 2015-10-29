/**
 * Created by artiom on 12/03/15.
 */


myapp.controller('ratesCtrl',['$rootScope', '$scope', 'invoiceFactory', 'generalFunctions', 'generalCache', 'colorTerminalesCache', 'loginService',
	function ($rootScope, $scope, invoiceFactory, generalFunctions, generalCache, colorTerminalesCache, loginService) {

		$scope.tasaAgp = false;

		$rootScope.predicate = 'terminal';

		$scope.tarifasElegidas = 1;
		$scope.total = 0;
		$scope.totalAgp = 0;
		$scope.totalPeso = 0;
		$scope.totalPesoAgp = 0;

		$scope.chartReporteTarifas = {
			title: "Códigos de tarifas",
			width: 600,
			height: 500,
			type: 'column',
			columns: 1,
			currency: true,
			stacked: false,
			is3D: false,
			money: 'DOL',
			data: [
				['Codigos', 'algo'],
				['hola', 0]
			],
			id: 1,
			image: null
		};

		$scope.chartTotalesPorTerminal = {
			title: "Totales por terminal",
			width: 500,
			height: 500,
			type: 'pie',
			currency: true,
			stacked: false,
			is3D: true,
			money: 'PES',
			data: [
				['BACTSSA', 0],
				['TERMINAL 4', 0],
				['TRP', 0]
			],
			id: 2,
			image: null
		};

		$scope.barColors = {
			"bactssa": colorTerminalesCache.get('Bactssa'),
			"terminal4": colorTerminalesCache.get('Terminal4'),
			"trp": colorTerminalesCache.get('Trp')
		};

		$scope.allRates = generalCache.get('allRates');

		$scope.configPanel = {
			tipo: 'panel-info',
			titulo: 'Tasas a las cargas',
			mensaje: 'No se han encontrado datos para los filtros seleccionados.'
		};

		// Fecha (dia y hora)
		$scope.fechaInicio = new Date();
		$scope.fechaFin = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

		// Variable para almacenar la info principal que trae del factory
		$scope.rates = {};

		$scope.model = {
			'tipo': 0,
			'fechaInicio': $scope.fechaInicio,
			'fechaFin': $scope.fechaFin
		};

		$scope.cargando = false;
		$scope.mostrarGrafico = false;

		/*$scope.deleteRow = function (index) {
			$scope.chartData.splice(index, 1);
		};
		$scope.addRow = function () {
			$scope.chartData.push([]);
		};*/
		$scope.selectRow = function (index) {
			$scope.selected = index;
		};
		/*$scope.rowClass = function (index) {
			return ($scope.selected === index) ? "selected" : "";
		};*/

		$scope.armarGrafico = function(){
			$scope.total = 0;
			$scope.totalAgp = 0;
			$scope.totalPeso = 0;
			$scope.totalPesoAgp = 0;

			$scope.chartTotalesPorTerminal.data = [
				['BACTSSA', 0],
				['TERMINAL 4', 0],
				['TRP', 0]
			];

			$scope.chartReporteTarifas.columns = 2;

			var base =[
				['Códigos', 'Tasa importación', 'Tasa exportación', 'Tasa removido'],
				['BACTSSA', 0, 0, 0],
				['TERMINAL 4', 0, 0, 0],
				['TRP', 0, 0, 0]
			];

			var column, row;
			$scope.rates.forEach(function(tasa){
				switch (tasa.rate){
					case 'IMPO':
						column = 1;
						break;
					case 'EXPO':
						column = 2;
						break;
					case 'REMOVIDO':
						column = 3;
						break;
				}
				switch (tasa.terminal){
					case 'BACTSSA':
						row = 1;
						break;
					case 'TERMINAL4':
						row = 2;
						break;
					case 'TRP':
						row = 3;
						break;
				}
				if ($scope.tasaAgp){
					$scope.chartTotalesPorTerminal.data[row - 1][1] += tasa.totalPesoAgp;
					base[row][column] = tasa.totalAgp;
				} else {
					$scope.chartTotalesPorTerminal.data[row - 1][1] += tasa.totalPeso;
					base[row][column] = tasa.total;
				}
				$scope.total += tasa.total;
				$scope.totalAgp += tasa.totalAgp;
				$scope.totalPeso += tasa.totalPeso;
				$scope.totalPesoAgp += tasa.totalPesoAgp;

			});
			$scope.chartReporteTarifas.data = base;
			$scope.mostrarGrafico = true;
		};

		$scope.openDate = function(event){
			generalFunctions.openDate(event);
		};

		$scope.hitEnter = function(evt){
			if(angular.equals(evt.keyCode,13))
				$scope.filtrar();
		};

		$scope.maxDate = new Date();

		$scope.$on('errorInesperado', function(e, mensaje){
			$scope.cargando = false;
			$scope.rates = [];
			$scope.configPanel = mensaje;
		});

		$scope.ponerDescripcion = function(codigo){
			return $scope.allRates[codigo];
		};

		$scope.cambioTasa = function(){
			$scope.tasaAgp = !$scope.tasaAgp;
			$scope.armarGrafico();
		};

		$scope.cargaRates = function () {
			if (!angular.isDefined($scope.model['fechaInicio'])) $scope.model.fechaInicio = $scope.fechaInicio;
			$scope.total = 0;
			$scope.chartTotalesPorTerminal.data = [
				['BACTSSA', 0],
				['TERMINAL 4', 0],
				['TRP', 0]
			];
			$scope.mostrarGrafico = false;
			$scope.cargando = true;
			$scope.configPanel = {
				tipo: 'panel-info',
				titulo: 'Tasas a las cargas',
				mensaje: 'No se han encontrado datos para los filtros seleccionados.'
			};
			invoiceFactory.getRatesInvoices($scope.model, function (data) {
				if (data.status === "OK") {
					$scope.rates = data.data;
					if (data.data.length > 0){
						$scope.armarGrafico();
					}
				} else {
					$scope.configPanel = {
						tipo: 'panel-danger',
						titulo: 'Tasas a las cargas',
						mensaje: 'Se ha producido un error al cargar los datos de tasas a las cargas.'
					};
				}
				$scope.cargando = false;
			});
		};

		$scope.descargarPdf = function(){

		};

		if (loginService.getStatus()) $scope.cargaRates();

		$scope.$on('terminoLogin', function(){
			$scope.cargaRates();
		});

	}]);
