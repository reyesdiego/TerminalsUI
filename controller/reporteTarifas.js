/**
 * Created by artiom on 02/10/14.
 */

myapp.controller('reporteTarifasCtrl', ['$scope', 'reportsFactory', 'priceFactory', 'dialogs', 'loginService', 'colorTerminalesCache', 'downloadFactory',
	function($scope, reportsFactory, priceFactory, dialogs, loginService, colorTerminalesCache, downloadFactory) {

		$scope.maxDate = new Date();
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

		$scope.totales = [0, 0, 0, 0];

		$scope.$on('errorDatos', function(){
			$scope.errorTarifario = true;
		});

		function traerDatos () {
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

		if (loginService.getStatus()){
			traerDatos();
		}

		$scope.$on('terminoLogin', function(){
			traerDatos();
		});

		$scope.recargarPricelist = function(){
			var pos;
			//$scope.agregarQuitarTodo(false);
			$scope.selectedList.forEach(function(price){
				if ($scope.tasas){
					pos = $scope.pricelistTasas.map(function(e) {
						return e._id
					}).indexOf(price._id);
					if (pos != -1){
						$scope.pricelistTasas[pos].graficar = price.graficar;
					}
				} else {
					pos = $scope.pricelist.map(function(e) {
						return e._id
					}).indexOf(price._id);
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

		$scope.agregarGrafico = function(precio){
			var i = $scope.tarifasGraficar.data.indexOf(precio.code);
			if (precio.graficar){
				if (i == -1){
					$scope.tarifasGraficar.data.push(precio.code);
					$scope.tablaGrafico.data.push(precio);
				}
			} else {
				$scope.tarifasGraficar.data.splice(i, 1);
				$scope.tablaGrafico.data.splice(i, 1);
			}
		};

		$scope.agregarQuitarTodo = function(onOff){
			$scope.filteredPrices.forEach(function(precio){
				precio.graficar = onOff;
				$scope.agregarGrafico(precio);
			});
		};

		$scope.mostrarGrafico = false;

		$scope.chartReporteTarifas = {
			title: 'Códigos de tarifas',
			width: 1400,
			height: 600,
			type: 'column',
			columns: 1,
			currency: true,
			stacked: false,
			is3D: true,
			money: 'DOL',
			data: [
				['Codigos', 'algo'],
				['hola', 2526]
			],
			id: 1,
			image: null
		};

		$scope.chartTotalesPorTarifa = {
			title: 'Totales por tarifas',
			width: 700,
			height: 600,
			type: 'pie',
			currency: true,
			stacked: false,
			is3D: true,
			money: 'DOL',
			data: [
				['Codigos', 0],
				['hola', 2526]
			],
			id: 2,
			image: null
		};

		$scope.chartTotalesPorTerminal = {
			title: 'Totales por terminal',
			width: 700,
			height: 600,
			type: 'pie',
			currency: true,
			stacked: false,
			is3D: true,
			money: 'DOL',
			data: [
				['Codigos', 0],
				['hola', 2526]
			],
			id: 3,
			image: null
		};

		$scope.barColors = {
			"bactssa": colorTerminalesCache.get('Bactssa'),
			"terminal4": colorTerminalesCache.get('Terminal4'),
			"trp": colorTerminalesCache.get('Trp')
		};

		$scope.hasta = new Date();
		$scope.desde = new Date($scope.hasta.getFullYear(), $scope.hasta.getMonth());

		$scope.isCollapsedDesde = true;
		$scope.isCollapsedHasta = true;

		$scope.selectRow = function (index) {
			$scope.selected = index;
		};
		$scope.rowClass = function (index) {
			return ($scope.selected === index) ? "selected" : "";
		};

		$scope.armarGraficoTarifas = function () {
			$scope.totales = [0, 0, 0, 0];

			$scope.loadingReporteTarifas = true;

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
					contarTerminales = data.data.length; //Determino cuantas terminales arrojaron resultados
					if (contarTerminales != 0){
						var totalesTerminal = [];
						var nuevaLineaTerminal = ['terminal', 0];
						data.data.forEach(function(resultado){ //Coloco las terminales en el array del gráfico
							nuevaLinea.push(resultado.terminal);
							nuevaLineaTerminal[0] = resultado.terminal;
							base.push(nuevaLinea.slice());
							totalesTerminal.push(nuevaLineaTerminal.slice());
							terminales.push(resultado.terminal);
							nuevaLinea = [];
						});
						var i = 1;
						var totalesTarifas = [];
						var nuevaLineaTarifas = [];
						$scope.tarifasElegidas = $scope.tablaGrafico.data.length;
						$scope.tablaGrafico.terminales = terminales;
						$scope.tablaGrafico.data.forEach(function(tarifa){
							var total = 0;
							var code = tarifa.code;
							var tarifaEsta = false;
							nuevaLineaTarifas.push(code);
							tarifa.conteo = [];
							tarifa.porcentaje = [];
							for (i=1; i<=contarTerminales; i++){
								if (angular.isDefined(data.data[i-1].data[code])){
									tarifaEsta = true;
									base[i].push(data.data[i-1].data[code]);
									tarifa.conteo.push(data.data[i-1].data[code]);
									total+=data.data[i-1].data[code];
									$scope.totales[i-1] += data.data[i-1].data[code];
									totalesTerminal[i-1][1] += data.data[i-1].data[code];
								} else if (tarifaEsta) {
									//La tarifa ya fue encontrada
									base[i].push(0);
									tarifa.conteo.push(0);
								} else if (angular.isDefined(data.data[i].data[code]) || angular.isDefined(data.data[i+1].data[code])){ //Hay que saber si la tarifa está en alguno de los otros
									tarifaEsta = true;
									base[i].push(0);
									tarifa.conteo.push(0);
								} else {
									var j;
									for (j = 0; j<contarTerminales; j++){
										tarifa.conteo.push(0);
									}
									i = contarTerminales;
								}
							}
							if (tarifaEsta){ //Solo se contabiliza si la tarifa fue encontrada
								base[0].push(code);
							}
							tarifa.conteo.push(total);
							$scope.totales[contarTerminales] += total;
							for (i=0; i<=contarTerminales-1; i++){
								var cuenta = (tarifa.conteo[i]*100)/tarifa.conteo[contarTerminales];
								tarifa.porcentaje.push(cuenta);
							}
							nuevaLineaTarifas.push(total);
							totalesTarifas.push(nuevaLineaTarifas.slice());
							nuevaLineaTarifas = [];
						});
						totalesTerminal.sort(function(a, b){
							var terminalA = a[0].toLowerCase(), terminalB = b[0].toLowerCase();
							if (terminalA < terminalB) //sort string ascending
								return -1;
							if (terminalA > terminalB)
								return 1;
							return 0; //default return value (no sorting)
						});
						$scope.chartReporteTarifas.columns = base[0].length - 1;
						$scope.chartTotalesPorTerminal.data = totalesTerminal;
						$scope.chartTotalesPorTarifa.data = totalesTarifas;
						$scope.chartReporteTarifas.data = base;
						$scope.mostrarGrafico = true;
					} else {
						dialogs.notify("Totales por tarifa", "No se encontraron datos para las fechas y tarifas seleccionadas.");
					}
					$scope.loadingReporteTarifas = false;
				});
			}
		};

		$scope.descargarPdf = function(){
			var data = {
				id: $scope.$id,
				desde: $scope.desde,
				hasta: $scope.hasta,
				hoy: new Date(),
				tabla: $scope.tablaGrafico,
				totales: $scope.totales,
				charts: [
					{filename: $scope.chartReporteTarifas.id, image: $scope.chartReporteTarifas.image, h: $scope.chartReporteTarifas.height, w: $scope.chartReporteTarifas.width},
					{filename: $scope.chartTotalesPorTerminal.id, image: $scope.chartTotalesPorTerminal.image, h: $scope.chartTotalesPorTerminal.height, w: $scope.chartTotalesPorTerminal.width},
					{filename: $scope.chartTotalesPorTarifa.id, image: $scope.chartTotalesPorTarifa.image, h: $scope.chartTotalesPorTarifa.height, w: $scope.chartTotalesPorTarifa.width}
				]
			};
			var nombreReporte = 'Reporte_tarifas.pdf';
			downloadFactory.convertToPdf(data, 'reporteTarifasPdf', function(data, status){
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
		}

	}]);