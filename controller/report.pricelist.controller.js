/**
 * Created by artiom on 02/10/14.
 */

myapp.controller('reporteTarifasCtrl', ['$scope', 'reportsFactory', 'priceFactory', 'dialogs', 'loginService', 'cacheService', 'downloadFactory',
	function($scope, reportsFactory, priceFactory, dialogs, loginService, cacheService, downloadFactory) {

		const barColors = {
			"bactssa": cacheService.colorTerminalesCache.get('Bactssa'),
			"terminal4": cacheService.colorTerminalesCache.get('Terminal4'),
			"trp": cacheService.colorTerminalesCache.get('Trp')
		};

		$scope.search = '';
		$scope.selectedList = [];
		$scope.pricelist = [];
		$scope.pricelistTasas = [];
		$scope.filteredPrices = [];

		$scope.datepickerOptions = {
			formatYear: 'yyyy',
			maxDate: new Date(),
			startingDay: 1
		};

		$scope.loadingReporteTarifas = false;

		$scope.tarifasElegidas = 1;

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

		$scope.$on('errorDatos', () => {
			$scope.errorTarifario = true;
		});

		$scope.$on('cambioPagina', (event, data) => {
			$scope.currentPage = data;
		});

		function traerDatos () {
			priceFactory.getPricelistAgp().then((response) => {
				$scope.pricelist = response.pricelist;
				$scope.pricelistTasas = response.pricelistTasas;
				$scope.pricelist.forEach((price) => {
					price.graficar = false;
				});
				$scope.pricelistTasas.forEach((price) => {
					price.graficar = false;
				});
				$scope.selectedList = $scope.pricelist;
			}).catch((error) => {
				console.log(error);
			});
		}

		if (loginService.isLoggedIn){
			traerDatos();
		}

		$scope.recargarPricelist = () => {
			let pos;
			//$scope.agregarQuitarTodo(false);
			$scope.selectedList.forEach((price) => {
				if ($scope.tasas){
					pos = $scope.pricelistTasas.map((e) => {
						return e._id
					}).indexOf(price._id);
					if (pos != -1){
						$scope.pricelistTasas[pos].graficar = price.graficar;
					}
				} else {
					pos = $scope.pricelist.map((e) => {
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

		$scope.agregarGrafico = (precio) => {
			let i = $scope.tarifasGraficar.data.indexOf(precio.code);
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

		$scope.agregarQuitarTodo = (onOff) => {
			$scope.filteredPrices.forEach((precio) => {
				precio.graficar = onOff;
				$scope.agregarGrafico(precio);
			});
		};

		$scope.mostrarGrafico = false;

		$scope.chartReporteTarifas = {
			options: {
				title: 'Códigos de tarifas',
				width: 1400,
				height: 600,
				columns: 1,
				currency: true,
				stacked: false,
				is3D: true,
				money: 'DOL',
				id: 1,
				image: null
			},
			data: [
				['Tarifa', 'Total']
			],
		};

		$scope.chartTotalesPorTarifa = {
			options: {
				title: 'Totales por tarifas',
				width: 700,
				height: 600,
				currency: true,
				stacked: false,
				is3D: true,
				money: 'DOL',
				id: 2,
				image: null
			},
			data: [
				['Codigos', 'Total']
			],
		};

		$scope.chartTotalesPorTerminal = {
			options: {
				title: 'Totales por terminal',
				width: 700,
				height: 600,
				currency: true,
				stacked: false,
				is3D: true,
				money: 'DOL',
				colors: [barColors.bactssa, barColors.terminal4, barColors.trp],
				id: 3,
				image: null
			},
			data: [
				['Codigos', 'Total']
			],
		};

		$scope.hasta = new Date();
		$scope.desde = new Date($scope.hasta.getFullYear(), $scope.hasta.getMonth());

		$scope.isCollapsedDesde = false;
		$scope.isCollapsedHasta = false;

		$scope.selectRow = (index, id) => {
			console.log(index);
			console.log(id);
			$scope.selected = index;
		};
		$scope.rowClass = (index) => {
			return ($scope.selected === index) ? "selected" : "";
		};

		$scope.armarGraficoTarifas = () => {
			$scope.totales = [0, 0, 0, 0];

			$scope.loadingReporteTarifas = true;

			if ($scope.tarifasGraficar.data.length <= 0){
				dialogs.notify("Totales por tarifa", "No se ha seleccionado ninguna tarifa para graficar.");
				$scope.mostrarGrafico = false;
				$scope.loadingReporteTarifas = false;
			} else {
				let base = [
					['Códigos']
				];
				let nuevaLinea = [];
				let contarTerminales = 0;
				let terminales = [];
				let fecha={
					'fechaInicio': $scope.desde,
					'fechaFin': $scope.hasta
				};
				reportsFactory.getReporteTarifas(fecha, $scope.tarifasGraficar, function(data){
					if (data.status == 'OK'){
						contarTerminales = data.data.length; //Determino cuantas terminales arrojaron resultados
						if (contarTerminales != 0){
							let totalesTerminal = [];
							let nuevaLineaTerminal = ['terminal', 0];
							data.data.forEach((resultado) => { //Coloco las terminales en el array del gráfico
								nuevaLinea.push(resultado.terminal);
								nuevaLineaTerminal[0] = resultado.terminal;
								base.push(nuevaLinea.slice());
								totalesTerminal.push(nuevaLineaTerminal.slice());
								terminales.push(resultado.terminal);
								nuevaLinea = [];
							});
							let i = 1;
							let totalesTarifas = [];
							let nuevaLineaTarifas = [];
							$scope.tarifasElegidas = $scope.tablaGrafico.data.length;
							$scope.tablaGrafico.terminales = terminales;
							$scope.tablaGrafico.data.forEach((tarifa) => {
								let total = 0;
								let code = tarifa.code;
								let tarifaEsta = false;
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
										let j;
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
									let cuenta = (tarifa.conteo[i]*100)/tarifa.conteo[contarTerminales];
									tarifa.porcentaje.push(cuenta);
								}
								nuevaLineaTarifas.push(total);
								totalesTarifas.push(nuevaLineaTarifas.slice());
								nuevaLineaTarifas = [];
							});
							totalesTerminal.sort((a, b) => {
								let terminalA = a[0].toLowerCase(), terminalB = b[0].toLowerCase();
								if (terminalA < terminalB) //sort string ascending
									return -1;
								if (terminalA > terminalB)
									return 1;
								return 0; //default return value (no sorting)
							});
							totalesTerminal.unshift(['Terminal', 'Total']);
							totalesTarifas.unshift(['Código', 'Total']);
							$scope.chartReporteTarifas.columns = base[0].length - 1;
							$scope.chartTotalesPorTerminal.data = totalesTerminal;
							$scope.chartTotalesPorTarifa.data = totalesTarifas;
							$scope.chartReporteTarifas.data = base;
							$scope.mostrarGrafico = true;
						} else {
							dialogs.notify("Totales por tarifa", "No se encontraron datos para las fechas y tarifas seleccionadas.");
						}
					} else {
						dialogs.error("Totales por tarifa", `Se produjo un error al cargar los datos.\n${data.meesage}`)
					}
					$scope.loadingReporteTarifas = false;
				});
			}
		};

		$scope.descargarPdf = () => {
			const data = {
				id: $scope.$id,
				desde: $scope.desde,
				hasta: $scope.hasta,
				hoy: new Date(),
				tabla: $scope.tablaGrafico,
				totales: $scope.totales,
				charts: [
					{filename: $scope.chartReporteTarifas.options.id, image: $scope.chartReporteTarifas.options.image, h: $scope.chartReporteTarifas.options.height, w: $scope.chartReporteTarifas.options.width},
					{filename: $scope.chartTotalesPorTerminal.options.id, image: $scope.chartTotalesPorTerminal.options.image, h: $scope.chartTotalesPorTerminal.options.height, w: $scope.chartTotalesPorTerminal.options.width},
					{filename: $scope.chartTotalesPorTarifa.options.id, image: $scope.chartTotalesPorTarifa.options.image, h: $scope.chartTotalesPorTarifa.options.height, w: $scope.chartTotalesPorTarifa.options.width}
				]
			};
			const nombreReporte = 'Reporte_tarifas.pdf';
			downloadFactory.convertToPdf(data, 'reporteTarifasPdf', nombreReporte).then().catch(() => {
				dialogs.error('Tarifario', 'Se ha producido un error al intentar exportar el tarifario a PDF');
			});
		}

	}]);