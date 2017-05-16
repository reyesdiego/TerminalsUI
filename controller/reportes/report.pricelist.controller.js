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

		//Array con las terminales
		$scope.tabsTerminales = [
			{nombre: 'AGP', active: true},
			{nombre: 'BACTSSA', active: false},
			{nombre: 'TERMINAL4', active: false},
			{nombre: 'TRP', active: false}
		];

		$scope.tarifasAgrupadas = true;

		function getPivotTableFields(){
			return {
				"Terminal": (item) => {return item.terminal;},
				"Cantidad": (item) => {return item.cantidad;},
				"Total": (item) => {return item.total;},
				"Tipo": (item) => {return item.norma;},
				"Medida": (item) => {return item.largo;},
				"Año": (item) => {return item.anio},
				"Mes": (item) => {return item.mes}
			}
		}

		$scope.tablePivot = {
			data: [],
			options: {
				derivedAttributes: getPivotTableFields(),
				hiddenAttributes: ["largo", "terminal", "total", "cantidad", "norma", "code", "anio", "mes"],
				rows: ["Terminal"],
				cols: ["Medida"],
				vals: ["Total"],
				rendererName: "Tabla",
				aggregatorName: "Suma"
				/*renderers: $.extend(
					$.pivotUtilities.renderers,
					$.pivotUtilities.c3_renderers
				)*/
			}
		};

		$scope.search = '';
		$scope.selectedList = [];
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
		$scope.tarifasGraficar = [];

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

		$scope.searchPrice = function(value, index, array){
			return value.code.toUpperCase().search($scope.search) > -1 || value.description.toUpperCase().search($scope.search) > -1 || value.largo == $scope.search;
		};

		$scope.cambiarListaTarifas = function(terminal){
			$scope.tabsTerminales.forEach((unTab) => {
				unTab.active = (unTab.nombre == terminal.nombre);
			});
			if (terminal.nombre == 'AGP'){
				$scope.selectedList = pricelistAgp;
			} else if (terminal.nombre == 'BACTSSA'){
				$scope.selectedList = pricelistBactssa;
			} else if (terminal.nombre == 'TERMINAL4'){
				$scope.selectedList = pricelistTerminal4;
			} else {
				$scope.selectedList = pricelistTrp;
			}
			$scope.totalItems = $scope.selectedList.length
		};

		let pricelistAgp = [];
		let pricelistAgpTasas = [];
		let pricelistBactssa = [];
		let pricelistTerminal4 = [];
		let pricelistTrp = [];

		function traerDatos () {
			priceFactory.getPricelistAgp().then((response) => {
				//console.log(response);
				pricelistAgp = response.pricelist;
				pricelistAgpTasas = response.pricelistTasas;
				$scope.selectedList = pricelistAgp;
			}).catch((error) => {
				$scope.errorTarifario = true;
			});

			priceFactory.getPricelistTerminal('BACTSSA').then((response) => {
				pricelistBactssa = filterTerminalPrices(response.data);
			}).catch((error) => {
				$scope.errorTarifario = true;
			});

			priceFactory.getPricelistTerminal('TERMINAL4').then((response) => {
				pricelistTerminal4 = filterTerminalPrices(response.data);
			}).catch((error) => {
				$scope.errorTarifario = true;
			});

			priceFactory.getPricelistTerminal('TRP').then((response) => {
				pricelistTrp = filterTerminalPrices(response.data);
			}).catch((error) => {
				$scope.errorTarifario = true;
			});
		}

		function filterTerminalPrices(prices){
			let filteredList = [];
			prices.forEach((price) => {
				if (price.tipoTarifa != 'A') filteredList.push(price);
			});
			return filteredList
		}

		if (loginService.isLoggedIn){
			traerDatos();
		}

		$scope.recargarPricelist = () => {
			let pos;
			//$scope.agregarQuitarTodo(false);
			$scope.selectedList.forEach((price) => {
				if ($scope.tasas){
					pos = pricelistAgpTasas.map((e) => {
						return e._id
					}).indexOf(price._id);
					if (pos != -1){
						pricelistAgpTasas[pos].graficar = price.graficar;
					}
				} else {
					pos = pricelistAgp.map((e) => {
						return e._id
					}).indexOf(price._id);
					if (pos != -1){
						pricelistAgp[pos].graficar = price.graficar;
					}
				}
			});
			if ($scope.tasas){
				$scope.selectedList = pricelistAgpTasas;
			} else {
				$scope.selectedList = pricelistAgp;
			}
		};

		$scope.agregarGrafico = (precio) => {
			let i = $scope.tarifasGraficar.indexOf(precio.code);
			if (precio.graficar){
				if (i == -1){
					$scope.tarifasGraficar.push(precio.code);
					$scope.tablaGrafico.data.push(precio);
				}
			} else {
				$scope.tarifasGraficar.splice(i, 1);
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
				width: '100%',
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
				width: '100%',
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
				width: '100%',
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

		$scope.model = {
			fechaInicio: new Date(new Date().getFullYear(), new Date().getMonth()),
			fechaFin: new Date()
		};

		//$scope.hasta = new Date();
		//$scope.desde = new Date($scope.hasta.getFullYear(), $scope.hasta.getMonth());

		$scope.isCollapsedDesde = false;
		$scope.isCollapsedHasta = false;

		$scope.selectRow = (index, id) => {
			//console.log(index);
			//console.log(id);
			$scope.selected = index;
		};
		$scope.rowClass = (index) => {
			return ($scope.selected === index) ? "selected" : "";
		};

		$scope.volver = () => {
			$scope.mostrarGrafico = false;
		};

		$scope.armarGraficoTarifas = (dinamico) => {
			$scope.loadingReporteTarifas = true;
			if (dinamico){
				$scope.tarifasAgrupadas = true;
				if ($scope.tarifasGraficar.length <= 0){
					$scope.tablePivot.options.derivedAttributes = getPivotTableFields();
				} else {
					$scope.tablePivot.options.derivedAttributes.Tarifa = (item) => {return item.code};
				}
				reportsFactory.getReporteTarifasPivot($scope.model, $scope.tarifasGraficar).then((data) => {
					$scope.tablePivot.data = data.data;
					$scope.mostrarGrafico = true;
				}).catch((err) => {
					dialogs.error('Reporte Tarifas', err.message);
					$scope.mostrarGrafico = false;
				}).finally(() => {
					$scope.loadingReporteTarifas = false;
				});
			} else {
				$scope.tarifasAgrupadas = false;
				$scope.totales = [0, 0, 0, 0];

				if ($scope.tarifasGraficar.length <= 0){
					dialogs.notify("Totales por tarifa", "No se ha seleccionado ninguna tarifa para graficar.");
					$scope.mostrarGrafico = false;
					$scope.loadingReporteTarifas = false;
				} else {
					let base = [
						['Códigos']
					];
					let contarTerminales = 0;
					let terminales = [];

					reportsFactory.getReporteTarifas($scope.model, $scope.tarifasGraficar, function(data){
						if (data.status == 'OK'){
							contarTerminales = data.data.length; //Determino cuantas terminales arrojaron resultados
							if (contarTerminales != 0){
								let totalesTerminal = [];
								const dataGrafico = data.data;
								dataGrafico.forEach((resultado) => { //Coloco las terminales en el array del gráfico
									base.push([resultado.terminal]);
									totalesTerminal.push([resultado.terminal, 0]);
									terminales.push(resultado.terminal);
								});
								let totalesTarifas = [];
								$scope.tarifasElegidas = $scope.tablaGrafico.data.length;
								$scope.tablaGrafico.terminales = terminales;
								$scope.tablaGrafico.data.forEach((tarifa) => {
									let total = 0;
									let code = tarifa.code;
									tarifa.mostrar = false;
									tarifa.conteo = [];
									tarifa.porcentaje = [];
									for (let i=1; i<=contarTerminales; i++){
										if (angular.isDefined(dataGrafico[i-1].data[code])){
											tarifa.mostrar = true;
											base[i].push(dataGrafico[i-1].data[code]);
											tarifa.conteo.push(dataGrafico[i-1].data[code]);
											total += dataGrafico[i-1].data[code];
											$scope.totales[i-1] += dataGrafico[i-1].data[code];
											totalesTerminal[i-1][1] += dataGrafico[i-1].data[code];
										} else if (tarifa.mostrar) {
											//La tarifa ya fue encontrada
											base[i].push(0);
											tarifa.conteo.push(0);
										} else if (angular.isDefined(dataGrafico[i].data[code]) || angular.isDefined(dataGrafico[i+1].data[code])){ //Hay que saber si la tarifa está en alguno de los otros
											tarifa.mostrar = true;
											base[i].push(0);
											tarifa.conteo.push(0);
										} else {
											i = contarTerminales;
										}
									}
									if (tarifa.mostrar){ //Solo se contabiliza si la tarifa fue encontrada
										base[0].push(code);
									}
									tarifa.conteo.push(total);
									$scope.totales[contarTerminales] += total;
									for (let i=0; i<=contarTerminales-1; i++){
										const cuenta = (tarifa.conteo[i]*100)/tarifa.conteo[contarTerminales];
										tarifa.porcentaje.push(cuenta);
									}
									totalesTarifas.push([code, total]);
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
							dialogs.error("Totales por tarifa", `Se produjo un error al cargar los datos.\n${data.message}`)
						}
						$scope.loadingReporteTarifas = false;
					});
				}

			}
		};

		$scope.descargarPdf = () => {
			let tablaReducida = {
				terminales: $scope.tablaGrafico.terminales,
				data: []
			};
			$scope.tablaGrafico.data.forEach((tarifa) => {
				if (tarifa.mostrar) tablaReducida.data.push(tarifa);
			});
			const data = {
				id: $scope.$id,
				desde: $scope.model.fechaInicio,
				hasta: $scope.model.fechaFin,
				hoy: new Date(),
				tabla: tablaReducida,
				totales: $scope.totales,
				charts: [
					{filename: $scope.chartReporteTarifas.options.id, image: $scope.chartReporteTarifas.options.image.data, h: $scope.chartReporteTarifas.options.image.h, w: $scope.chartReporteTarifas.options.image.w},
					{filename: $scope.chartTotalesPorTerminal.options.id, image: $scope.chartTotalesPorTerminal.options.image.data, h: $scope.chartTotalesPorTerminal.options.image.h, w: $scope.chartTotalesPorTerminal.options.image.w},
					{filename: $scope.chartTotalesPorTarifa.options.id, image: $scope.chartTotalesPorTarifa.options.image.data, h: $scope.chartTotalesPorTarifa.options.image.h, w: $scope.chartTotalesPorTarifa.options.image.w}
				]
			};
			const nombreReporte = 'Reporte_tarifas.pdf';
			downloadFactory.convertToPdf(data, 'reporteTarifasPdf', nombreReporte).then().catch(() => {
				dialogs.error('Tarifario', 'Se ha producido un error al intentar exportar el tarifario a PDF');
			});
		}

	}]);