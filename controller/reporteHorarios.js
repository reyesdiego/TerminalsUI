/**
 * Created by artiom on 02/10/14.
 */

var reporteHorariosCtrl = myapp.controller('reporteHorariosCtrl', function($scope, reportsFactory, invoiceFactory, vouchersFactory, priceFactory, gatesFactory, loginService, dialogs, $state){

	$scope.fechaDesde = new Date();
	$scope.fechaHasta = new Date();
	$scope.fechaDesde.setHours(0, 0);
	$scope.fechaHasta.setMinutes(0);
	$scope.maxDate = new Date();
	$scope.monedaFija = 'DOL';
	$scope.search = '';
	$scope.pricelist = [];
	$scope.filteredPrices = [];

	$scope.loadingReportGates = false;
	$scope.loadingReporteTarifas = false;

	$scope.model = {
		'fechaDesde': $scope.fechaDesde,
		'fechaHasta': $scope.fechaHasta,
		'contenedor': '',
		'buque': '',
		'order': '"gateTimestamp":-1'
	};

	$scope.datosReporteGates = {
		'gatesTotal': 0,
		'gatesEarly': 0,
		'gatesLate': 0,
		'gatesOk': 0
	};

	$scope.tarifasElegidas = 1;

	$scope.filtrar = function (filtro, contenido) {
		switch (filtro) {
			case 'contenedor':
				$scope.model.contenedor = contenido;
				break;
			case 'buque':
				$scope.model.buque = contenido;
				break;
		}
		$scope.cargarReporteHorarios();
	};

	$scope.maxDate = new Date();

	vouchersFactory.getVouchersType(function(data){
		$scope.comprobantesTipos = data.data;
	});

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

	$scope.barColors = {
		"bactssa":$scope.colorBactssa,
		"terminal4": $scope.colorTerminal4,
		"trp": $scope.colorTrp
	};
	$scope.chartSeries = {3: {type: "line"}};

	$scope.columnChart = 'column';
	$scope.pieChart = 'pie';

	$scope.chartTitleReporteTarifas = "Códigos de tarifas";
	$scope.chartWidthReporteTarifas = 1200;
	$scope.chartHeightReporteTarifas = 600;
	$scope.chartDataReporteTarifas = [
		['Codigos', 'algo'],
		['hola', 2526]
	];

	$scope.chartTitleBarrasHorarios = "Detalle cumplimiento de turnos";
	$scope.chartWidthBarrasHorarios = 500;
	$scope.chartHeightBarrasHorarios = 400;

	$scope.chartDataBarras = [];

	$scope.chartTitleTortaHorarios = "Porcentaje";
	$scope.chartWidthTortaHorarios = 550;
	$scope.chartHeightTortaHorarios = 530;

	$scope.chartDataTorta = [];

	$scope.chartDataTarifasBactssa = [];
	$scope.chartDataTarifasTerminal4 = [];
	$scope.chartDataTarifasTrp = [];

	$scope.resultadosTarifasBactssa = [];
	$scope.resultadosTarifasTerminal4 = [];
	$scope.resultadosTarifasTrp = [];

	$scope.matchesBactssa = [];
	$scope.matchesTerminal4 = [];
	$scope.matchesTrp = [];

	$scope.hasta = new Date();
	$scope.desde = new Date($scope.hasta.getFullYear(), $scope.hasta.getMonth());
	$scope.mesDesdeHorarios = new Date($scope.hasta.getFullYear() + '-' + ($scope.hasta.getMonth() + 1) + '-01' );

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

	$scope.cargarReporteHorarios = function(){
		if ($state.current.name == 'reports'){
			console.log($state.current.name);
			$scope.loadingReportGates = true;
			gatesFactory.getReporteHorarios(cargaDatos(), function(data){
				$scope.datosReporteGates = data.data;
				var graficoBarra = [
					['Turnos', 'Cantidad', { role: 'annotation' } ],
					['Tardes', 0, ''],
					['Antes de turno', 0, ''],
					['En horario', 0, '']
				];
				var graficoTorta = [
					['Tardes', 0],
					['Antes de turno', 0],
					['En horario', 0]
				];
				graficoBarra[1][1] = $scope.datosReporteGates.gatesLate;
				graficoBarra[2][1] = $scope.datosReporteGates.gatesEarly;
				graficoBarra[3][1] = $scope.datosReporteGates.gatesOk;

				graficoTorta[0][1] = $scope.datosReporteGates.gatesLate;
				graficoTorta[1][1] = $scope.datosReporteGates.gatesEarly;
				graficoTorta[2][1] = $scope.datosReporteGates.gatesOk;

				$scope.chartDataBarras = graficoBarra.slice();
				$scope.chartDataTorta = graficoTorta.slice();
				$scope.loadingReportGates = false;
			});
		}
	};

});