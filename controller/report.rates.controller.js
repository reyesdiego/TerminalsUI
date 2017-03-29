/**
 * Created by artiom on 12/03/15.
 */


myapp.controller('ratesCtrl',['$rootScope', '$scope', 'invoiceFactory', 'generalFunctions', 'cacheService', 'loginService', 'downloadFactory', 'dialogs', '$filter',
	function ($rootScope, $scope, invoiceFactory, generalFunctions, cacheService, loginService, downloadFactory, dialogs, $filter) {

		const barColors = {
			"bactssa": cacheService.colorTerminalesCache.get('Bactssa'),
			"terminal4": cacheService.colorTerminalesCache.get('Terminal4'),
			"trp": cacheService.colorTerminalesCache.get('Trp')
		};

		$scope.tasaAgp = false;

		$rootScope.predicate = 'terminal';

		$scope.tarifasElegidas = 1;
		$scope.total = 0;
		$scope.totalAgp = 0;
		$scope.totalPeso = 0;
		$scope.totalPesoAgp = 0;

		$scope.datepickerOptions = [
			{maxDate: new Date()},
			{maxDate: new Date(), datepickerMode: 'month', minMode: 'month'},
			{maxDate: new Date(), datepickerMode: 'year', minMode: 'year'}
		];

		$scope.meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

		$scope.chartReporteTarifas = {
			options: {
				title: "Detalle por tarifas",
				width: 1400,
				height: 600,
				series: {7: {type: "line"}},
				columns: 8,
				currency: true,
				stacked: false,
				is3D: false,
				money: 'PES',
				id: 1,
				image: null
			},
			data: [
				['Fecha', '1465', '1466', '1467', 'NAGPI', 'NAGPE', 'TASAI', 'TASAE', 'Promedio']
			]
		};

		$scope.chartTotalesPorTerminal = {
			options: {
				title: "Totales por terminal",
				width: 500,
				height: 500,
				currency: true,
				stacked: false,
				is3D: true,
				colors: [barColors.bactssa, barColors.terminal4, barColors.trp],
				money: 'PES',
				id: 2,
				image: null
			},
			data: [
				['Terminal', 'Total']
			]
		};

		$scope.chartDetallePorTerminalFecha = {
			options: {
				title: "",
				width: 700,
				height: 500,
				currency: true,
				stacked: false,
				is3D: true,
				money: 'PES',
				id: 3,
				image: null
			},
			data: [
				['saludo', 'numero']
			]
		};

		$scope.chartDetallePorTerminalPeriodo = {
			options: {
				title: "",
				width: 700,
				height: 500,
				currency: true,
				stacked: false,
				is3D: true,
				money: 'PES',
				id: 4,
				image: null
			},
			data: [
				['saludo', 'numero']
			]
		};

		$scope.allRates = cacheService.matchesCache.get('allRates');

		$scope.configPanel = {
			tipo: 'panel-info',
			titulo: 'Tasas a las cargas',
			mensaje: 'No se han encontrado datos para los filtros seleccionados.'
		};

		// Fecha (dia y hora)
		$scope.fechaInicio = new Date();
		$scope.fechaFin = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

		// Variable para almacenar la info principal que trae del factory
		$scope.rates = [];
		$scope.detalleRates = {};

		$scope.model = {
			'fechaInicio': $scope.fechaInicio,
			'fechaFin': $scope.fechaFin
		};

		$scope.modelDetalle = {
			tipo: 'date',
			contarHaciaAtras: 0,
			fechaInicio: new Date(),
			fechaFin: new Date()
		};

		$scope.cargando = false;
		$scope.mostrarGrafico = false;
		$scope.verDetalleTerminal = false;

		function obtenerDescripcionFecha(datosDia){
			switch ($scope.modelDetalle.tipo){
				case 'date':
					return $filter('date')(datosDia.date, 'dd/MM/yyyy');
					break;
				case 'month':
					return ($scope.meses[datosDia.month-1] + ' del ' + datosDia.year);
					break;
				case 'year':
					return $filter('date')(datosDia.date, 'yyyy');
					break;
			}
		};

		function detallar(){
			$scope.verDetalleTerminal = false;
			switch ($scope.detallarTerminal){
				case 'BACTSSA':
					$scope.chartDetallePorTerminalFecha.data = [
						['Tarifa', 'Total'],
						['1465', 0],
						['1466', 0],
						['1467', 0]
					];
					$scope.chartDetallePorTerminalPeriodo.data = [
						['Tarifa', 'Total'],
						['1465', 0],
						['1466', 0],
						['1467', 0]
					];
					break;
				case 'TERMINAL4':
					$scope.chartDetallePorTerminalFecha.data = [
						['Tarifa', 'Total'],
						['NAGPI', 0],
						['NAGPE', 0]
					];
					$scope.chartDetallePorTerminalPeriodo.data = [
						['Tarifa', 'Total'],
						['NAGPI', 0],
						['NAGPE', 0]
					];
					break;
				case 'TRP':
					$scope.chartDetallePorTerminalFecha.data = [
						['Tarifa', 'Total'],
						['TASAI', 0],
						['TASAE', 0]
					];
					$scope.chartDetallePorTerminalPeriodo.data = [
						['Tarifa', 'Total'],
						['TASAI', 0],
						['TASAE', 0]
					];
					break;
			}
			let row;
			let ponerFecha;
			let totalDetallePeriodo = 0, totalDetalleFecha = 0;
			$scope.detalleRates.forEach((datosDia) => {
				if (datosDia.terminal == $scope.detallarTerminal){
					ponerFecha = obtenerDescripcionFecha(datosDia);
					switch (datosDia.code){
						case '1465':
						case 'NAGPI':
						case 'TASAI':
							row = 1;
							break;
						case '1466':
						case 'NAGPE':
						case 'TASAE':
							row = 2;
							break;
						case '1467':
							row = 3;
					}
					if ($scope.tasaAgp){
						$scope.chartDetallePorTerminalPeriodo.data[row][1] += datosDia.totalPesoAgp;
						totalDetallePeriodo += datosDia.totalPesoAgp;
					} else {
						$scope.chartDetallePorTerminalPeriodo.data[row][1] += datosDia.totalPeso;
						totalDetallePeriodo += datosDia.totalPeso;
					}
					if ($scope.detallarFecha == ponerFecha){
						if ($scope.tasaAgp){
							$scope.chartDetallePorTerminalFecha.data[row][1] += datosDia.totalPesoAgp;
							totalDetalleFecha += datosDia.totalPesoAgp;
						} else {
							$scope.chartDetallePorTerminalFecha.data[row][1] += datosDia.totalPeso;
							totalDetalleFecha += datosDia.totalPeso;
						}
					}
				}
			});
			$scope.chartDetallePorTerminalPeriodo.options.title = 'Total de ' + $scope.detallarTerminal + ' para el período graficado:\n' + $filter('currency')(totalDetallePeriodo, '$ ' );
			switch ($scope.modelDetalle.tipo){
				case 'date':
					$scope.chartDetallePorTerminalFecha.options.title = 'Total de ' + $scope.detallarTerminal + ' para el día ' + $scope.detallarFecha + ':\n' + $filter('currency')(totalDetalleFecha, '$ ');
					break;
				case 'month':
					$scope.chartDetallePorTerminalFecha.options.title = 'Total de ' + $scope.detallarTerminal + ' para ' + $scope.detallarFecha + ':\n' + $filter('currency')(totalDetalleFecha, '$ ');
					break;
				case 'year':
					$scope.chartDetallePorTerminalFecha.options.title = 'Total de ' + $scope.detallarTerminal + ' para el año ' + $scope.detallarFecha + ':\n' + $filter('currency')(totalDetalleFecha, '$ ');
					break;
			}
			$scope.verDetalleTerminal = true;
		}

		$scope.detallarTerminal = '';
		$scope.detallarFecha = '';

		$scope.selectRow = (index, id) => {
			if (angular.isDefined(index) && id == 1 && index.column < 8){
				let rate = $scope.chartReporteTarifas.data[0][index.column];
				switch (rate){
					case '1465':
					case '1466':
					case '1467':
						$scope.detallarTerminal = 'BACTSSA';
						break;
					case 'NAGPI':
					case 'NAGPE':
						$scope.detallarTerminal = 'TERMINAL4';
						break;
					case 'TASAI':
					case 'TASAE':
						$scope.detallarTerminal = 'TRP';
						break;
				}
				if (angular.isDefined(index.row)){
					$scope.detallarFecha = $scope.chartReporteTarifas.data[index.row + 1][0];
				} else {
					switch ($scope.modelDetalle.tipo){
						case 'date':
							$scope.detallarFecha = $filter('date')($scope.modelDetalle.fechaFin, 'dd/MM/yyyy');
							break;
						case 'month':
							$scope.detallarFecha = $scope.meses[$scope.modelDetalle.fechaFin.getMonth()] + ' del ' + $scope.modelDetalle.fechaFin.getFullYear();
							break;
						case 'year':
							$scope.detallarFecha = $filter('date')($scope.modelDetalle.fechaFin, 'yyyy');
							break;
					}
				}
				$scope.$apply(detallar());
			}
		};

		$scope.actualizarDetalle = function(){
			$scope.mostrarGrafico = false;
			$scope.verDetalleTerminal = false;
			switch ($scope.modelDetalle.tipo){
				case 'date':
					//$scope.modelDetalle.fechaInicio = new Date($scope.modelDetalle.fechaFin.getFullYear(), $scope.modelDetalle.fechaFin.getMonth(), $scope.modelDetalle.fechaFin.getDate() - $scope.modelDetalle.contarHaciaAtras);
					$scope.modelDetalle.fechaFin.setDate($scope.modelDetalle.fechaInicio.getDate() + 1);
					break;
				case 'month':
					$scope.modelDetalle.fechaInicio = new Date($scope.modelDetalle.fechaFin.getFullYear(), $scope.modelDetalle.fechaFin.getMonth() - $scope.modelDetalle.contarHaciaAtras, $scope.modelDetalle.fechaFin.getDate());
					$scope.modelDetalle.fechaFin.setMonth($scope.modelDetalle.fechaFin.getMonth() + 1);
					break;
				case 'year':
					$scope.modelDetalle.fechaInicio = new Date($scope.modelDetalle.fechaFin.getFullYear() - $scope.modelDetalle.contarHaciaAtras, $scope.modelDetalle.fechaFin.getMonth(), $scope.modelDetalle.fechaFin.getDate());
					$scope.modelDetalle.fechaFin.setFullYear($scope.modelDetalle.fechaFin.getFullYear() + 1);
					break;
			}
			invoiceFactory.getDetailRates($scope.modelDetalle, function(data){
				if (data.status == 'OK'){
					$scope.detalleRates = data.data;
					armarGraficoDetalle();
					$scope.mostrarGrafico = true;
				}
			});
		};

		function armarGrafico(){

			$scope.total = 0;
			$scope.totalAgp = 0;
			$scope.totalPeso = 0;
			$scope.totalPesoAgp = 0;

			let base = [
				['Terminal', 'Total'],
				['BACTSSA', 0],
				['TERMINAL 4', 0],
				['TRP', 0]
			];

			let row;
			$scope.rates.forEach((tasa) => {
				switch (tasa.terminal){
					case 'BACTSSA':
						row = 2;
						break;
					case 'TERMINAL4':
						row = 3;
						break;
					case 'TRP':
						row = 4;
						break;
				}
				if ($scope.tasaAgp){
					base[row - 1][1] += tasa.totalPesoAgp;
				} else {
					base[row - 1][1] += tasa.totalPeso;
				}
				$scope.total += tasa.total;
				$scope.totalAgp += tasa.totalAgp;
				$scope.totalPeso += tasa.totalPeso;
				$scope.totalPesoAgp += tasa.totalPesoAgp;

			});
			$scope.chartTotalesPorTerminal.data = base;
		};

		$scope.openDate = (event) => {
			generalFunctions.openDate(event);
		};

		$scope.hitEnter = (evt) => {
			if(angular.equals(evt.keyCode,13))
				$scope.filtrar();
		};

		$scope.$on('errorInesperado', (e, mensaje) => {
			$scope.cargando = false;
			$scope.rates = [];
			$scope.configPanel = mensaje;
		});

		function ponerDescripcion(codigo){
			return $scope.allRates[codigo];
		};

		$scope.cambioTasa = () => {
			$scope.tasaAgp = !$scope.tasaAgp;
			armarGrafico();
			armarGraficoDetalle();
			if ($scope.verDetalleTerminal){
				detallar();
			}
		};

		function armarGraficoDetalle(){
			//Matriz base de los datos del gráfico, ver alternativa al hardcodeo de los nombres de las terminales
			$scope.chartReporteTarifas.data = [
				['Fecha', '1465', '1466', '1467', 'NAGPI', 'NAGPE', 'TASAI', 'TASAE', 'Promedio']
			];
			//Para cambiar entre columnas
			let lugarFila = 1;
			//Para cargar promedio
			//var acum = 0;
			let fila = ['', 0, 0, 0, 0, 0, 0, 0, 0];
			let filaEncontrada = false;
			let ponerFecha;
			//Los datos vienen en objetos que incluyen la fecha, la terminal, y la suma facturada(cnt)
			//ordenados por fecha
			$scope.detalleRates.forEach((datosDia) => {
				switch ($scope.modelDetalle.tipo){
					case 'date':
						ponerFecha = $filter('date')(datosDia.date, 'dd/MM/yyyy');
						break;
					case 'month':
						ponerFecha = ($scope.meses[datosDia.month-1] + ' del ' + datosDia.year);
						break;
					case 'year':
						ponerFecha = $filter('date')(datosDia.date, 'yyyy');
						break;
				}
				switch (datosDia.code){
					case "1465":
						lugarFila = 1;
						break;
					case "1466":
						lugarFila = 2;
						break;
					case "1467":
						lugarFila = 3;
						break;
					case "NAGPI":
						lugarFila = 4;
						break;
					case "NAGPE":
						lugarFila = 5;
						break;
					case "TASAI":
						lugarFila = 6;
						break;
					case "TASAE":
						lugarFila = 7;
						break;
				}
				$scope.chartReporteTarifas.data.forEach((unaFila) => {
					if (unaFila[0] == ponerFecha){
						filaEncontrada = true;
						if ($scope.tasaAgp){
							unaFila[lugarFila] += datosDia.totalPesoAgp;
							unaFila[8] += datosDia.totalPesoAgp;
						} else {
							unaFila[lugarFila] += datosDia.totalPeso;
							unaFila[8] += datosDia.totalPeso;
						}
					}
				});
				if (!filaEncontrada){
					fila = ['', 0, 0, 0, 0, 0, 0, 0, 0];
					fila[0] = ponerFecha;
					if ($scope.tasaAgp){
						fila[lugarFila] += datosDia.totalPesoAgp;
						fila[8] += datosDia.totalPesoAgp;
					} else {
						fila[lugarFila] += datosDia.totalPeso;
						fila[8] += datosDia.totalPeso;
					}
					$scope.chartReporteTarifas.data.push(fila.slice());
				}
				filaEncontrada = false;
			});
			for (let i = 1;i<$scope.chartReporteTarifas.data.length;i++){
				$scope.chartReporteTarifas.data[i][8] = $scope.chartReporteTarifas.data[i][8]/7
			}
		}

		$scope.cargaRates = () =>{
			$scope.verDetalleTerminal = false;
			switch ($scope.modelDetalle.tipo){
				case 'date': //diario
					$scope.model.fechaFin = new Date($scope.model.fechaInicio.getTime() + 24 * 60 * 60 * 1000);
					break;
				case 'month': //mensual
					$scope.model.fechaInicio.setDate(1);
					$scope.model.fechaFin = new Date($scope.model.fechaInicio.getFullYear(), $scope.model.fechaInicio.getMonth()+1, $scope.model.fechaInicio.getDate());
					break;
				case 'year': //anual
					$scope.model.fechaInicio.setDate(1);
					$scope.model.fechaInicio.setMonth(0);
					$scope.model.fechaFin = new Date($scope.model.fechaInicio.getFullYear()+1, $scope.model.fechaInicio.getMonth(), $scope.model.fechaInicio.getDate());
					break;
			}
			$scope.modelDetalle.fechaFin = new Date($scope.model.fechaInicio);
			if (!angular.isDefined($scope.model['fechaInicio'])) $scope.model.fechaInicio = $scope.fechaInicio;
			$scope.total = 0;
			$scope.chartTotalesPorTerminal.data = [
				['Terminal', 'Totales'],
				['BACTSSA', 0],
				['TERMINAL 4', 0],
				['TRP', 0]
			];
			$scope.cargando = true;
			$scope.configPanel = {
				tipo: 'panel-info',
				titulo: 'Tasas a las cargas',
				mensaje: 'No se han encontrado datos para los filtros seleccionados.'
			};
			invoiceFactory.getRatesInvoices($scope.model, (data) => {
				if (data.status === "OK") {
					$scope.rates = data.data;
					$scope.rates.forEach((rate) => {
						rate.descripcion = ponerDescripcion(rate.code);
					});
					if (data.data.length > 0){
						armarGrafico();
					}
				} else {
					$scope.configPanel = {
						tipo: 'panel-danger',
						titulo: 'Tasas a las cargas',
						mensaje: 'Se ha producido un error al cargar los datos de tasas a las cargas.'
					};
				}
				$scope.cargando = false;
				$scope.actualizarDetalle();
			});
		};

		$scope.descargarPdf = () => {
			let data = {
				id: $scope.$id,
				rates: $scope.rates,
				tasaAgp: $scope.tasaAgp,
				tipo: $scope.modelDetalle.tipo,
				fecha: $scope.model.fechaInicio,
				hoy: new Date(),
				detalle: $scope.verDetalleTerminal,
				totales: $scope.chartTotalesPorTerminal.data,
				charts: [
					{filename: $scope.chartReporteTarifas.options.id, image: $scope.chartReporteTarifas.options.image, h: $scope.chartReporteTarifas.options.height, w: $scope.chartReporteTarifas.options.width},
					{filename: $scope.chartTotalesPorTerminal.options.id, image: $scope.chartTotalesPorTerminal.options.image, h: $scope.chartTotalesPorTerminal.options.height, w: $scope.chartTotalesPorTerminal.options.width},
					{filename: $scope.chartDetallePorTerminalFecha.options.id, image: $scope.chartDetallePorTerminalFecha.options.image, h: $scope.chartDetallePorTerminalFecha.options.height, w: $scope.chartDetallePorTerminalFecha.options.width},
					{filename: $scope.chartDetallePorTerminalPeriodo.options.id, image: $scope.chartDetallePorTerminalPeriodo.options.image, h: $scope.chartDetallePorTerminalPeriodo.options.height, w: $scope.chartDetallePorTerminalPeriodo.options.width}
				]
			};
			let nombreReporte = 'Reporte_tasas.pdf';
			downloadFactory.convertToPdf(data, 'reporteRatesPdf', nombreReporte).then(() => {

			}).catch(() => {
				dialogs.error('Tarifario', 'Se ha producido un error al intentar exportar el tarifario a PDF');
			});
		};

		if (loginService.isLoggedIn) $scope.cargaRates();

	}]);
